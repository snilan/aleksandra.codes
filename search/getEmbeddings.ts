import type { OpenAIApi } from "openai";
import { isRateLimitExceeded } from "./isRateLimitExceeded";

import { PineconeVector, PineconeVectorPending, PostContent } from "./types";
import { openaiEmbeddingModel } from "./types";

export async function getEmbeddingsForPostContent({
  content,
  id,
  title,
  openai,
  model = openaiEmbeddingModel,
}: {
  content: PostContent;
  title: string;
  id: string;
  openai: OpenAIApi;
  model?: string;
}) {
  const pendingVectors: PineconeVectorPending[] = content.chunks.map(
    ({ text, start, end }, index) => {
      return {
        id: `${id}:${index}`,
        input: text,
        metadata: {
          index,
          id,
          title,
          text,
          end,
          start,
        },
      };
    }
  );

  const vectors: PineconeVector[] = [];

  let timeout = 10_000;
  while (pendingVectors.length) {
    // We have 20 RPM on Free Trial, and 60 RPM on Pay-as-you-go plan, so we'll do exponential backoff.
    const pendingVector = pendingVectors.shift()!;
    try {
      const { data: embed } = await openai.createEmbedding({
        input: pendingVector.input,
        model,
      });

      const vector: PineconeVector = {
        id: pendingVector.id,
        metadata: pendingVector.metadata,
        values: embed.data[0]?.embedding || [],
      };

      vectors.push(vector);
    } catch (err: unknown) {
      if (isRateLimitExceeded(err)) {
        pendingVectors.unshift(pendingVector);
        console.log("OpenAI rate limit exceeded, retrying in", timeout, "ms");
        await new Promise((resolve) => setTimeout(resolve, timeout));
        timeout *= 2;
      } else {
        throw err;
      }
    }
  }

  return vectors;
}