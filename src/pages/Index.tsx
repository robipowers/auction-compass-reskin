import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, History, BarChart3, Target, Brain, MessageSquare } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Context Analysis",
    description: "Capture Yesterday's structure, Today's inventory, and key reference levels",
  },
  {
    icon: Brain,
    title: "AI Strategist",
    description: "Get AI-powered structural critique with 3 scenario hypotheses",
  },
  {
    icon: Target,
    title: "Probability Tracking",
    description: "Monitor scenario probabilities with real-time updates",
  },
  {
    icon: MessageSquare,
    title: "Trading Coach",
    description: "Real-time AMT coaching as price action unfolds",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-[0.02]" />
        
        {/* Gradient Orbs */}
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm backdrop-blur-sm">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-foreground">Institutional AMT Trading Tool</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              <span className="gradient-text">Auction Plan</span>
            </h1>
            
            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              Professional pre-market analysis using Auction Market Theory.
              Plan your trades, get AI-powered structural critiques, and receive
              real-time coaching during the session.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild variant="hero" size="xl">
                <Link to="/plan">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Create Auction Plan
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/history">
                  <History className="mr-2 h-5 w-5" />
                  View History
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Cards */}
      <section className="container pb-20">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Card variant="interactive" className="group">
            <Link to="/plan">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-[var(--shadow-lg)] transition-transform group-hover:scale-110">
                  <TrendingUp className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Create Auction Plan</CardTitle>
                <CardDescription className="text-base">
                  Build your pre-market analysis with Yesterday's Context, Today's
                  Context, and Reference Levels. Get AI-powered structural critique.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary group-hover:underline">
                  Start planning →
                </span>
              </CardContent>
            </Link>
          </Card>

          <Card variant="interactive" className="group">
            <Link to="/history">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-success to-success/60 shadow-[var(--shadow-lg)] transition-transform group-hover:scale-110">
                  <History className="h-7 w-7 text-success-foreground" />
                </div>
                <CardTitle className="text-2xl">Trading History</CardTitle>
                <CardDescription className="text-base">
                  Review your past plans, trades, and performance analytics.
                  Export detailed reports for your trading journal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-success group-hover:underline">
                  View history →
                </span>
              </CardContent>
            </Link>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container pb-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-semibold sm:text-3xl text-foreground">
            Auction Market Theory Workflow
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="glass"
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 border border-primary/20">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container pb-20">
        <Card variant="elevated" className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle className="text-xl">About Auction Market Theory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Auction Market Theory views price as a two-sided auction process where
              buyers and sellers are constantly negotiating value. Unlike traditional
              technical analysis, AMT focuses on understanding <em>why</em> price moves
              to certain levels and what it means for future price action.
            </p>
            <p>
              Key concepts include Value Area (where 70% of trading occurs), Point of
              Control (price with highest volume), and reference levels from previous
              sessions that act as potential support/resistance.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
