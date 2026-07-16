/**
 * AI 公开 API（无需认证）
 * 复用 blogService /pc/ai/stream 端点
 */

export type AiMode = 'continue' | 'polish' | 'summarize' | 'translate' | 'outline' | 'chat';

export interface AiStreamParams {
  mode: AiMode;
  content?: string;
  selectedText?: string;
  targetLang?: string;
  topic?: string;
  question?: string;
}

/**
 * SSE 流式调用 AI。
 * 返回 async generator，每个 chunk 输出一段文本。
 */
export async function* aiStream(params: AiStreamParams): AsyncGenerator<string, void, undefined> {
  const response = await fetch('/pc/ai/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI 请求失败 (${response.status}): ${err}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('浏览器不支持流式读取');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;

      const jsonStr = trimmed.slice(5).trim();
      if (jsonStr === '[DONE]') return;

      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed?.text) yield parsed.text;
      } catch { /* skip */ }
    }
  }
}
