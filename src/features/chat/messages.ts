import { VRMExpressionPresetName } from "@pixiv/three-vrm";

export type Role = "assistant" | "system" | "user";

// ChatGPT API
export type Message = {
  role: Role;
  content: string;
};

const talkStyles = [
  "talk",
  "happy",
  "sad",
  "angry",
  "fear",
  "surprised",
] as const;
export type TalkStyle = (typeof talkStyles)[number];

export type Talk = {
  style: TalkStyle;
  message: string;
};

const emotions = ["neutral", "happy", "angry", "sad", "relaxed"] as const;
type EmotionType = (typeof emotions)[number] & VRMExpressionPresetName;

/**
 * A set that includes utterances, voice emotions, and model emotional expressions.
 */
export type Screenplay = {
  expressions: string[];
  emotion: EmotionType;
  talk: Talk;
};

export const textsToScreenplay = (
  texts: string[],
): Screenplay[] => {
  const screenplays: Screenplay[] = [];
  let prevEmotion = "neutral";
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];

    // emotion in brackets [emotion]
    const emoteMatch = text.match(/\[(.*?)\]/);
    const tag = (emoteMatch && emoteMatch[1]) || prevEmotion;

    // expressions in asterisks *expression*
    const expressionsMatch = text.match(/\*(.*?)\*/);
    const expressions = expressionsMatch && expressionsMatch.filter((expression: string) => expression[0] !== '*') || [];
    const message = text.replace(/\[(.*?)\]/g, "").replace(/\*(.*?)\*/g, "");

    let emotion = prevEmotion;
    if (emotions.includes(tag as any)) {
      emotion = tag;
      prevEmotion = tag;
    }

    screenplays.push({
      expressions: expressions,
      emotion: emotion as EmotionType,
      talk: {
        style: emotionToTalkStyle(emotion as EmotionType),
        message: message,
      },
    });
  }

  return screenplays;
};

const emotionToTalkStyle = (emotion: EmotionType): TalkStyle => {
  switch (emotion) {
    case "angry":
      return "angry";
    case "happy":
      return "happy";
    case "sad":
      return "sad";
    default:
      return "talk";
  }
};
