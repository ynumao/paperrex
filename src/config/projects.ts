export interface Project {
    id: string;
    title: string;
    description: string;
    url: string;
    tags: string[];
    icon: string;
    gradient: string;
}

export const projects: Project[] = [
    {
        id: "kami-mihon",
        title: "紙見本ジェネレーター",
        description: "3Dで紙の質感や折りをシミュレーションするツールです。",
        url: "/kami-mihon",
        tags: ["Three.js", "React", "Next.js"],
        icon: "FileText",
        gradient: "from-blue-500 to-cyan-400",
    },
    {
        id: "ai-lp-gen",
        title: "AI LP Generator",
        description: "Gemini AIを使用して、LPの構成とコピーを自動生成。画像プロンプトも取得可能です。",
        url: "#",
        tags: ["Next.js", "Gemini AI", "Pollinations"],
        icon: "Layout",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        id: "chrome-ext",
        title: "Google Chat AI Reply",
        description: "Google Chat上でGeminiが返信内容を提案するブラウザ拡張機能。",
        url: "#",
        tags: ["Chrome Extension", "React", "Gemini AI"],
        icon: "MessageSquare",
        gradient: "from-orange-400 to-red-500",
    },
];
