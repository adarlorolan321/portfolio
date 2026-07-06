import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { playRecords } from "../../db/schema.js";

const MAX_MESSAGE_LENGTH = 500;
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

const json = (body: unknown, init?: ResponseInit) => Response.json(body, init);

const readLimit = (url: URL) => {
  const requestedLimit = Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT);

  if (!Number.isInteger(requestedLimit) || requestedLimit < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(requestedLimit, MAX_LIMIT);
};

const parsePlayRecord = async (req: Request) => {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return { error: "Request body must be valid JSON." };
  }

  if (!body || typeof body !== "object") {
    return { error: "Request body must be an object." };
  }

  const { message, score } = body as { message?: unknown; score?: unknown };
  const normalizedMessage = typeof message === "string" ? message.trim() : "";
  const normalizedScore = Number(score);

  if (!normalizedMessage) {
    return { error: "Message is required." };
  }

  if (normalizedMessage.length > MAX_MESSAGE_LENGTH) {
    return { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` };
  }

  if (!Number.isInteger(normalizedScore) || normalizedScore < 0) {
    return { error: "Score must be a whole number greater than or equal to 0." };
  }

  return {
    data: {
      message: normalizedMessage,
      score: normalizedScore,
    },
  };
};

export default async (req: Request) => {
  if (req.method === "GET") {
    const url = new URL(req.url);
    const records = await db
      .select()
      .from(playRecords)
      .orderBy(desc(playRecords.createdAt))
      .limit(readLimit(url));

    return json({ records });
  }

  if (req.method === "POST") {
    const parsed = await parsePlayRecord(req);

    if ("error" in parsed) {
      return json({ error: parsed.error }, { status: 400 });
    }

    const [record] = await db.insert(playRecords).values(parsed.data).returning();

    return json({ record }, { status: 201 });
  }

  return json({ error: "Method not allowed." }, { status: 405 });
};

export const config = {
  path: "/api/play-records",
};
