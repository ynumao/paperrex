"use client";

import { motion } from "framer-motion";
import { LucideIcon, FileText, Layout, MessageSquare, ExternalLink, ArrowRight } from "lucide-react";
import { Project } from "@/config/projects";

const icons: Record<string, LucideIcon> = {
    FileText,
    Layout,
    MessageSquare,
};

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
    const Icon = icons[project.icon] || FileText;

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10"
        >
            <div className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${project.gradient} opacity-0 blur-xl transition-opacity group-hover:opacity-20`} />

            <div className="flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between">
                    <div className={`rounded-lg bg-gradient-to-br ${project.gradient} p-2.5 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <motion.div
                        whileHover={{ rotate: 45 }}
                        className="text-white/40 group-hover:text-white"
                    >
                        <ExternalLink className="h-5 w-5" />
                    </motion.div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60">
                    {project.title}
                </h3>

                <p className="mb-6 text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">
                    {project.description}
                </p>

                <div className="mt-auto">
                    <div className="mb-6 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[10px] font-medium text-slate-400 backdrop-blur-md"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <a
                        href={project.url}
                        className="flex items-center gap-2 text-sm font-semibold text-white/50 transition-colors group-hover:text-white"
                    >
                        Launch App
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>
            </div>
        </motion.div>
    );
};
