"use client";

import { motion } from "framer-motion";
import { Background } from "@/components/launcher/Background";
import { ProjectCard } from "@/components/launcher/ProjectCard";
import { projects } from "@/config/projects";
import { Sparkles, Terminal, Code2 } from "lucide-react";

export default function LauncherPage() {
    return (
        <main className="relative min-h-screen text-slate-50 selection:bg-blue-500/30">
            <Background />

            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                {/* Header */}
                <header className="mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center justify-center gap-2 mb-6"
                    >
                        <div className="rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/20 backdrop-blur-md">
                            <span className="flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5" />
                                Next Generation Workspace
                            </span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                    >
                        App Launcher
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="mx-auto max-w-2xl text-lg leading-8 text-slate-400"
                    >
                        開発したプロトタイプやツールへ、シームレスにアクセス。
                        あなたのクリエイティビティを加速させるランチャー。
                    </motion.p>
                </header>

                {/* Categories / Stats (Visual decoration) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
                >
                    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
                        <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                            <Code2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Total Projects</p>
                            <p className="text-xl font-bold text-white">{projects.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
                        <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-400">
                            <Terminal className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Status</p>
                            <p className="text-xl font-bold text-white">Active</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
                        <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Platform</p>
                            <p className="text-xl font-bold text-white">Web-Based</p>
                        </div>
                    </div>
                </motion.div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                        >
                            <ProjectCard project={project} />
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <footer className="mt-40 border-t border-white/5 pt-10 text-center">
                    <p className="text-sm text-slate-500">
                        &copy; 2026 Developer Dashboard. Crafted for Excellence.
                    </p>
                </footer>
            </div>
        </main>
    );
}
