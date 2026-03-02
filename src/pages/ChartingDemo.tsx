import { useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  VolumeProfile,
  VolumeProfileConfig,
  useVolumeProfileConfig,
  generateMockVolumeProfile,
  OrderFlowPanel,
  generateMockOrderFlow,
  MarketInternals,
  generateMockInternals,
  DrawingToolbar,
  DrawingTool,
  AMTOverlays,
  generateMockAMTData,
} from "@/components/charting";

export default function ChartingDemo() {
  const vpConfig = useVolumeProfileConfig();
  const [showVpConfig, setShowVpConfig] = useState(false);
  const [activeTool, setActiveTool] = useState<DrawingTool>("select");

  // Generate mock data
  const vpData = generateMockVolumeProfile(18400, 20);
  const previousVpData = generateMockVolumeProfile(18370, 20);
  const orderFlowData = generateMockOrderFlow();
  const internalsData = generateMockInternals();
  const amtData = generateMockAMTData(18400);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Advanced Charting Demo</h1>
          <p className="text-muted-foreground text-sm">
            Preview of all charting components
          </p>
        </div>

        <Tabs defaultValue="volume-profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="volume-profile">Volume Profile</TabsTrigger>
            <TabsTrigger value="order-flow">Order Flow</TabsTrigger>
            <TabsTrigger value="internals">Market Internals</TabsTrigger>
            <TabsTrigger value="drawing">Drawing Tools</TabsTrigger>
            <TabsTrigger value="amt">AMT Overlays</TabsTrigger>
          </TabsList>

          {/* Volume Profile Tab */}
          <TabsContent value="volume-profile" className="space-y-4">
            <div className="flex gap-4">
              <Card className="flex-1 p-6 relative bg-background/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">NQ Futures - Volume Profile</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVpConfig(!showVpConfig)}
                  >
                    {showVpConfig ? "Hide" : "Show"} Settings
                  </Button>
                </div>
                <div className="flex gap-6">
                  <div className="flex-1 h-[400px] bg-secondary/30 rounded-lg border p-4 relative">
                    {/* Simulated price axis */}
                    <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between text-xs text-muted-foreground">
                      <span>18,500</span>
                      <span>18,475</span>
                      <span>18,450</span>
                      <span>18,425</span>
                      <span>18,400</span>
                    </div>
                    {/* Volume Profile */}
                    <div className="absolute right-4 top-4 bottom-4">
                      <VolumeProfile
                        data={vpData}
                        height={360}
                        width={180}
                        showPreviousSession={vpConfig.showPreviousSession}
                        previousData={previousVpData}
                        valueAreaPercent={vpConfig.valueAreaPercent}
                      />
                    </div>
                  </div>
                  {showVpConfig && (
                    <VolumeProfileConfig
                      profileType={vpConfig.profileType}
                      period={vpConfig.period}
                      valueAreaPercent={vpConfig.valueAreaPercent}
                      showPreviousSession={vpConfig.showPreviousSession}
                      displayMode={vpConfig.displayMode}
                      onProfileTypeChange={vpConfig.setProfileType}
                      onPeriodChange={vpConfig.setPeriod}
                      onValueAreaChange={vpConfig.setValueAreaPercent}
                      onShowPreviousSessionChange={vpConfig.setShowPreviousSession}
                      onDisplayModeChange={vpConfig.setDisplayMode}
                      onClose={() => setShowVpConfig(false)}
                    />
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Order Flow Tab */}
          <TabsContent value="order-flow">
            <OrderFlowPanel data={orderFlowData} height={350} />
          </TabsContent>

          {/* Market Internals Tab */}
          <TabsContent value="internals">
            <div className="max-w-md">
              <MarketInternals
                data={internalsData}
                onSetAlert={(symbol, threshold) => {
                  console.log(`Alert set for ${symbol} at ${threshold}`);
                }}
              />
            </div>
          </TabsContent>

          {/* Drawing Tools Tab */}
          <TabsContent value="drawing">
            <div className="flex gap-4">
              <DrawingToolbar
                activeTool={activeTool}
                onToolChange={setActiveTool}
                canUndo={false}
                canRedo={false}
                orientation="vertical"
              />
              <Card className="flex-1 h-[500px] bg-secondary/30 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">
                    Selected Tool: <span className="text-primary">{activeTool}</span>
                  </p>
                  <p className="text-sm">
                    Click and drag to draw on a real chart
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* AMT Overlays Tab */}
          <TabsContent value="amt">
            <Card className="p-6">
              <h2 className="font-semibold mb-4">AMT Overlays Preview</h2>
              <div className="h-[400px] bg-secondary/30 rounded-lg border relative overflow-hidden">
                {/* Price axis */}
                <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between text-xs text-muted-foreground z-10">
                  <span>18,500</span>
                  <span>18,450</span>
                  <span>18,400</span>
                  <span>18,350</span>
                  <span>18,300</span>
                </div>
                {/* AMT Overlays */}
                <AMTOverlays
                  balanceZones={amtData.balanceZones}
                  imbalanceZones={amtData.imbalanceZones}
                  levels={amtData.levels}
                  chartHeight={400}
                  chartWidth={800}
                  priceRange={{ high: 18500, low: 18300 }}
                  showBalance={true}
                  showImbalance={true}
                  showInitialBalance={true}
                  showPreviousSession={true}
                />
              </div>
              <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-blue-500/30 border border-blue-500/50 rounded" />
                  Balance Zone
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-red-500/30 border border-dashed border-red-500/50 rounded" />
                  Imbalance Zone
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-amber-500 rounded" />
                  POC
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-green-500 rounded" />
                  VAH/VAL
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-purple-500 rounded" />
                  Initial Balance
                </span>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
