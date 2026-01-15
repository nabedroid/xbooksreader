import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ボリュームIDのキャッシュ (DriveLetter -> VolumeID)
const volumeCache: Map<string, string> = new Map();

// ボリュームID -> ドライブレター の逆引きキャッシュは、ドライブ構成が変わる可能性があるので
// 毎回更新するか、短いTTLを持たせるべき。
// ここでは単純化のため、getVolumeId 時にキャッシュし、getDriveFromId は動的検索（またはキャッシュ全走査）とする。

/**
 * 指定されたパス（ドライブ）のボリュームシリアル番号を取得
 * @param drivePath ドライブ文字（例: "C:", "D:\Folder"）
 */
export async function getVolumeId(drivePath: string): Promise<string | null> {
  try {
    // Windowsのみ対応："D:"のような形式を抽出
    const match = drivePath.match(/^([a-zA-Z]:)/);
    if (!match) return null;
    const driveLetter = match[1].toUpperCase();

    // キャッシュ確認
    if (volumeCache.has(driveLetter)) {
      return volumeCache.get(driveLetter) || null;
    }

    // キャッシュがなければリフレッシュ
    await refreshVolumeCache();

    return volumeCache.get(driveLetter) || null;

  } catch (error) {
    console.error(`Failed to get VolumeID for ${drivePath}:`, error);
    return null;
  }
}

/**
 * すべての論理ドライブの情報を取得してキャッシュを更新
 */
export async function refreshVolumeCache(): Promise<void> {
  try {
    // wmicが非推奨・削除されている環境に対応するため、PowerShellを使用
    const cmd = `powershell -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, VolumeSerialNumber | ConvertTo-Json"`;
    const { stdout } = await execAsync(cmd);

    if (!stdout.trim()) return;

    const data = JSON.parse(stdout);
    const drives = Array.isArray(data) ? data : [data];

    volumeCache.clear();
    for (const drive of drives) {
      if (drive.DeviceID && drive.VolumeSerialNumber) {
        volumeCache.set(drive.DeviceID.toUpperCase(), drive.VolumeSerialNumber);
      }
    }
  } catch (error) {
    console.error('Failed to refresh volume cache via PowerShell:', error);
    // フォールバック（何もしない、または古い方法を試す等）
  }
}

/**
 * ボリュームIDから現在のドライブ割り当てを取得
 * キャッシュになければ全更新して探す
 */
export async function getDriveFromVolumeId(volumeId: string): Promise<string | null> {
  // キャッシュから検索
  for (const [drive, serial] of volumeCache.entries()) {
    if (serial === volumeId) return drive;
  }

  // 見つからなければリフレッシュ
  await refreshVolumeCache();

  for (const [drive, serial] of volumeCache.entries()) {
    if (serial === volumeId) return drive;
  }

  return null; // 未接続
}
