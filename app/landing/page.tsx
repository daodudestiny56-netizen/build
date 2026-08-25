'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import StampBadge from '@/components/StampBadge';
import {
  ShieldAlert,
  Zap,
  Bot,
  Clock,
  Inbox,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2,
  PlusSquare,
  Layers,
  Sparkles,
  LifeBuoy,
  TrendingUp,
} from 'lucide-react';

export default function LandingPage() {
  const steps = [
    {
      step: '01',
      title: 'Customer Submits a Ticket',
      desc: 'Users submit support requests via email, web forms, or chat. Raw requests enter the intake queue in real time.',
      icon: PlusSquare,
      badge: 'INTAKE',
      badgeStatus: 'new' as const,
    },
    {
      step: '02',
      title: 'AI Analyzes & Categorizes',
      desc: 'Our AI engine reads the message, assesses urgency (Low to Critical), assigns a category, and routes it to the right department instantly.',
      icon: Bot,
      badge: 'AI TRIAGE',
      badgeStatus: 'in_progress' as const,
    },
    {
      step: '03',
      title: 'SLA Daemon Guards Timelines',
      desc: 'An automated background daemon tracks customer wait times against SLA targets, instantly escalating delayed cases to prevent breaches.',
      icon: Clock,
      badge: 'ESCALATION DAEMON',
      badgeStatus: 'escalated' as const,
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant AI Classification',
      desc: 'No manual sorting required. incoming tickets are immediately scored by sentiment, urgency, and category.',
      color: 'border-[#00E5FF]',
    },
    {
      icon: Clock,
      title: 'Automatic SLA Monitoring',
      desc: 'Guarantees fast response times with background SLA checks that automatically flag overdue tickets for team intervention.',
      color: 'border-[#FFD600]',
    },
    {
      icon: Users,
      title: 'Customer Tier Context',
      desc: 'Integrated CRM intelligence surfaces VIP enterprise accounts and priority SLAs directly inside every support case workbench.',
      color: 'border-[#00E676]',
    },
    {
      icon: ShieldAlert,
      title: 'Real-Time Escalation Alerts',
      desc: 'Visual indicators and live alert banners ensure urgent customer issues are resolved before they impact your business.',
      color: 'border-[#FF3B00]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#F4F0EA] flex flex-col font-sans selection:bg-[#FF3B00] selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <section className="relative bg-[#16181E] border-3 border-[#F4F0EA] p-6 sm:p-10 shadow-[8px_8px_0px_#000000] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#262933] pb-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-[#00E676] rounded-full animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-wider text-[#00E676] uppercase">
                AI Dispatch Platform
              </span>
            </div>
            <StampBadge status="new" customText="SIMPLIFIED FOR YOU" />
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold uppercase tracking-tight leading-none text-[#F4F0EA]">
              Smart Customer Support <br />
              <span className="text-[#FF3B00] underline decoration-4 underline-offset-4">
                Triage &amp; Escalation
              </span>
            </h1>
            <p className="font-mono text-sm sm:text-base text-slate-300 leading-relaxed">
              TRIAGE 3D automatically sorts, prioritizes, and routes incoming customer support requests using AI. It continuously monitors target SLA response times so your team never misses an urgent customer issue.
            </p>
          </div>

          {/* Call-To-Action Button Group */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/"
              className="btn-3d-signal px-5 py-3 font-mono text-xs font-bold uppercase flex items-center space-x-2"
            >
              <Layers className="w-4 h-4 stroke-[2.5]" />
              <span>Launch Live Feed</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              href="/intake"
              className="btn-3d px-5 py-3 font-mono text-xs font-bold uppercase flex items-center space-x-2 bg-[#0D0E12] text-[#F4F0EA] border-[#F4F0EA]"
            >
              <PlusSquare className="w-4 h-4 stroke-[2.5]" />
              <span>Test Intake Simulator</span>
            </Link>

            <Link
              href="/deliverables"
              className="btn-3d px-5 py-3 font-mono text-xs font-bold uppercase flex items-center space-x-2 bg-[#FFD600] text-[#0D0E12] border-[#F4F0EA]"
            >
              <FileText className="w-4 h-4 stroke-[2.5]" />
              <span>Submission Deliverables</span>
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="space-y-6">
          <div className="border-l-4 border-[#FF3B00] pl-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F4F0EA]">
              How TRIAGE 3D Works
            </h2>
            <p className="font-mono text-xs text-slate-400 mt-1">
              A 3-step automated workflow designed to eliminate manual support ticket sorting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-[#16181E] border-3 border-[#F4F0EA] p-6 shadow-[5px_5px_0px_#000000] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-black text-[#FF3B00]">
                        {item.step}
                      </span>
                      <StampBadge status={item.badgeStatus} customText={item.badge} />
                    </div>

                    <div className="p-2.5 bg-[#0D0E12] border-2 border-[#262933] w-fit">
                      <Icon className="w-6 h-6 text-[#F4F0EA] stroke-[2.5]" />
                    </div>

                    <h3 className="font-display text-lg font-bold uppercase text-[#F4F0EA]">
                      {item.title}
                    </h3>

                    <p className="font-mono text-xs text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#262933] flex items-center text-[11px] font-mono text-[#00E676]">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    <span>AUTOMATED STEP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="space-y-6">
          <div className="border-l-4 border-[#00E5FF] pl-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F4F0EA]">
              Core System Features
            </h2>
            <p className="font-mono text-xs text-slate-400 mt-1">
              Everything built into this platform for modern support operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className={`bg-[#16181E] border-3 ${feat.color} p-6 shadow-[6px_6px_0px_#000000] space-y-3`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#0D0E12] border border-[#262933]">
                      <Icon className="w-5 h-5 text-[#F4F0EA] stroke-[2.5]" />
                    </div>
                    <h3 className="font-display text-base font-bold uppercase text-[#F4F0EA]">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="font-mono text-xs text-slate-300 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Navigation Directory */}
        <section className="bg-[#16181E] border-3 border-[#F4F0EA] p-6 sm:p-8 shadow-[6px_6px_0px_#000000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#262933] pb-3">
            <h2 className="font-display text-xl font-bold uppercase text-[#F4F0EA] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFD600]" />
              Quick Navigation Shortcuts
            </h2>
            <span className="font-mono text-xs text-[#00E676] font-bold">READY TO EXPLORE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/"
              className="p-4 bg-[#0D0E12] border-2 border-[#262933] hover:border-[#FF3B00] transition group space-y-2"
            >
              <div className="flex items-center justify-between">
                <Layers className="w-5 h-5 text-[#FF3B00]" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
              </div>
              <div className="font-display font-bold text-sm uppercase">Dispatch Feed</div>
              <div className="font-mono text-[11px] text-slate-400">View live incoming support tickets and status filters.</div>
            </Link>

            <Link
              href="/intake"
              className="p-4 bg-[#0D0E12] border-2 border-[#262933] hover:border-[#00E5FF] transition group space-y-2"
            >
              <div className="flex items-center justify-between">
                <PlusSquare className="w-5 h-5 text-[#00E5FF]" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
              </div>
              <div className="font-display font-bold text-sm uppercase">Intake Simulator</div>
              <div className="font-mono text-[11px] text-slate-400">Submit test customer messages for AI triage.</div>
            </Link>

            <Link
              href="/cases"
              className="p-4 bg-[#0D0E12] border-2 border-[#262933] hover:border-[#FFD600] transition group space-y-2"
            >
              <div className="flex items-center justify-between">
                <Inbox className="w-5 h-5 text-[#FFD600]" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
              </div>
              <div className="font-display font-bold text-sm uppercase">Cases Queue</div>
              <div className="font-mono text-[11px] text-slate-400">Browse and manage active customer case workbenches.</div>
            </Link>

            <Link
              href="/customers"
              className="p-4 bg-[#0D0E12] border-2 border-[#262933] hover:border-[#00E676] transition group space-y-2"
            >
              <div className="flex items-center justify-between">
                <Users className="w-5 h-5 text-[#00E676]" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
              </div>
              <div className="font-display font-bold text-sm uppercase">CRM Directory</div>
              <div className="font-mono text-[11px] text-slate-400">Manage customer accounts and SLA tier rules.</div>
            </Link>
          </div>
        </section>
      </main>

      {/* Simplified Footer */}
      <footer className="border-t-2 border-[#262933] bg-[#0D0E12] py-4 text-center text-xs font-mono text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 gap-2">
          <span>TRIAGE 3D // AI-POWERED SUPPORT DISPATCH &amp; SLA ESCALATION ENGINE</span>
          <Link href="/deliverables" className="text-[#FFD600] font-bold hover:underline">
            VIEW HACKATHON DELIVERABLES
          </Link>
        </div>
      </footer>
    </div>
  );
}
