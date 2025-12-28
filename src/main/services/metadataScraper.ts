/**
 * Webメタデータ取得サービス
 * DLsite, FANZAなどから情報を取得する
 */
import * as cheerio from 'cheerio';
import { ScrapedBook } from '@/types';

// User-Agent設定（スクレイピング対策回避のため一般的ブラウザに偽装）
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

/**
 * HTMLを取得するヘルパー関数
 * Node.js 18以降のfetchを使用
 */
async function fetchHtml(url: string, headers: Record<string, string> = {}): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      ...headers
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // テキストとして取得（UTF-8前提）
  // 必要であればArrayBufferを取得してTextDecoderでデコードする処理に変更可能
  return await response.text();
}

/**
 * 検索クエリに基づいて各サイトを検索
 */
export async function searchWebMetadata(query: string): Promise<ScrapedBook[]> {
  const results: ScrapedBook[] = [];

  try {
    // 並列実行
    const [dlsiteResults, fanzaResults] = await Promise.allSettled([
      searchDLsite(query),
      searchFANZA(query)
    ]);

    if (dlsiteResults.status === 'fulfilled') {
      results.push(...dlsiteResults.value);
    } else {
      console.error('DLsite search failed:', dlsiteResults.reason);
    }

    if (fanzaResults.status === 'fulfilled') {
      results.push(...fanzaResults.value);
    } else {
      console.error('FANZA search failed:', fanzaResults.reason);
    }

  } catch (error) {
    console.error('Search error:', error);
  }

  return results;
}

/**
 * DLsite検索
 */
async function searchDLsite(query: string): Promise<ScrapedBook[]> {
  const books: ScrapedBook[] = [];
  const encodedQuery = query.replace(/ +/g, '+');
  const searchUrl = `https://www.dlsite.com/maniax/fsr/=/keyword/${encodedQuery}`;

  try {
    const html = await fetchHtml(searchUrl);
    const $ = cheerio.load(html);
    const items = $('.work_img_main').toArray();

    for (const element of items) {
      // 上位5件程度に制限
      if (books.length >= 5) break;

      const title = $(element).find('.work_name a').text().trim();
      const link = $(element).find('.work_name a').attr('href') || '';
      const circle = $(element).find('.maker_name > a').text().trim();
      const author = $(element).find('.author > a').text().trim();
      const imageUrl = $(element).find('img').attr('src') || '';
      let tags: string[] = [];
      // 詳細ページのHTMLを取得して、タグを取得する
      const productHtml = await fetchHtml(link);
      const $product = cheerio.load(productHtml);
      const infos = $product('#work_outline tr').toArray();

      for (const info of infos) {
        const key = $product(info).find('th').text().trim();
        if (key !== 'ジャンル') continue;
        tags = $product(info).find('td a').toArray().map(tag => $product(tag).text().trim());
      }

      if (title) {
        books.push({
          title,
          circle: circle || undefined,
          author: author || undefined,
          tags,
          imageUrl: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
          siteName: 'DLsite',
          url: link
        });
      }
    };

  } catch (error) {
    console.error('DLsite scraping error:', error);
    throw error;
  }

  return books;
}

/**
 * FANZA (DMM) 同人検索
 */
async function searchFANZA(query: string): Promise<ScrapedBook[]> {
  const books: ScrapedBook[] = [];
  // FANZA同人の検索URL (一般向けではなくR18同人をターゲットと仮定)
  const encodedQuery = query.replace(/ +/g, '+');
  const searchUrl = `https://www.dmm.co.jp/dc/doujin/-/list/narrow/=/word=${encodedQuery}/`;
  console.log(searchUrl);

  try {
    const html = await fetchHtml(searchUrl, { 'Cookie': 'age_check_done=1;' });

    const $ = cheerio.load(html);
    const items = $('.productList__item').toArray();

    for (const element of items) {
      if (books.length >= 5) break;

      const title = $(element).find('.tileListTtl__txt').text().trim();
      const link = $(element).find('.tileListTtl__txt a').attr('href') || '';
      const author = $(element).find('.tileListTtl__txt--author').text().trim();
      const imageUrl = $(element).find('.tileListImg img').attr('src') || '';
      // 詳細ページのHTMLを取得して、タグを取得する
      const productHtml = await fetchHtml(link, { 'Cookie': 'age_check_done=1;' });
      const $product = cheerio.load(productHtml);
      const tags = $product('.genreTagList__item').toArray().map(li => $product(li).text().trim());

      if (title) {
        books.push({
          title: title,
          circle: undefined,
          author: author || undefined,
          tags: tags || undefined,
          imageUrl: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
          siteName: 'FANZA',
          url: link
        });
      }
    };

  } catch (error) {
    console.error('FANZA scraping error:', error);
    // FANZAはアクセス制限が厳しい場合がある
  }

  return books;
}
