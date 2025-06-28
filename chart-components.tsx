import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity, Target } from "lucide-react";

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface TeamPerformanceChartProps {
  data: ChartDataPoint[];
  title?: string;
  type?: 'bar' | 'line' | 'area';
  height?: number;
  showTrend?: boolean;
  className?: string;
}

function TeamPerformanceChart({ 
  data, 
  title = "Team Performance", 
  type = 'bar',
  height = 300,
  showTrend = true,
  className = ""
}: TeamPerformanceChartProps) {
  const [selectedMetric, setSelectedMetric] = useState('value');
  
  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  const trend = useMemo(() => {
    if (data.length < 2) return 0;
    const first = data[0].value;
    const last = data[data.length - 1].value;
    return ((last - first) / first) * 100;
  }, [data]);

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke={chartColors[0]}
              strokeWidth={3}
              dot={{ fill: chartColors[0], strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke={chartColors[0]}
              fill={chartColors[0]}
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      default:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey={selectedMetric} 
              fill={chartColors[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {title}
          </CardTitle>
          {showTrend && (
            <div className="flex items-center gap-2">
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length > 0 && Object.keys(data[0]).length > 2 && (
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(data[0]).filter(key => key !== 'name' && typeof data[0][key] === 'number').map(key => (
                  <SelectItem key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <ResponsiveContainer width="100%" height={height}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface LeagueComparisonChartProps {
  data: Array<{
    league: string;
    teams: number;
    avgPoints: number;
    avgGoals: number;
    totalValue: number;
  }>;
  className?: string;
}

function LeagueComparisonChart({ data, className = "" }: LeagueComparisonChartProps) {
  const [metric, setMetric] = useState('avgPoints');
  
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          League Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="avgPoints">Average Points</SelectItem>
            <SelectItem value="avgGoals">Average Goals</SelectItem>
            <SelectItem value="totalValue">Total Value (€M)</SelectItem>
          </SelectContent>
        </Select>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="league" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                typeof value === 'number' && name === 'totalValue' ? `€${value}M` : value,
                name
              ]}
            />
            <Bar 
              dataKey={metric} 
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface PlayerRadarChartProps {
  player: {
    name: string;
    stats: {
      pace: number;
      shooting: number;
      passing: number;
      dribbling: number;
      defending: number;
      physical: number;
    };
  };
  comparison?: {
    name: string;
    stats: {
      pace: number;
      shooting: number;
      passing: number;
      dribbling: number;
      defending: number;
      physical: number;
    };
  };
  className?: string;
}

function PlayerRadarChart({ player, comparison, className = "" }: PlayerRadarChartProps) {
  const data = [
    { attribute: 'Pace', player: player.stats.pace, comparison: comparison?.stats.pace },
    { attribute: 'Shooting', player: player.stats.shooting, comparison: comparison?.stats.shooting },
    { attribute: 'Passing', player: player.stats.passing, comparison: comparison?.stats.passing },
    { attribute: 'Dribbling', player: player.stats.dribbling, comparison: comparison?.stats.dribbling },
    { attribute: 'Defending', player: player.stats.defending, comparison: comparison?.stats.defending },
    { attribute: 'Physical', player: player.stats.physical, comparison: comparison?.stats.physical },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Player Comparison
        </CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>{player.name}</span>
          </div>
          {comparison && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>{comparison.name}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="attribute" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar 
              name={player.name}
              dataKey="player" 
              stroke="#3B82F6" 
              fill="#3B82F6" 
              fillOpacity={0.2}
              strokeWidth={2}
            />
            {comparison && (
              <Radar 
                name={comparison.name}
                dataKey="comparison" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
            )}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface MarketValueDistributionProps {
  data: Array<{
    position: string;
    value: number;
    count: number;
  }>;
  className?: string;
}

function MarketValueDistribution({ data, className = "" }: MarketValueDistributionProps) {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Market Value Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`€${Number(value).toLocaleString()}M`, 'Value']} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-3">
            <h4 className="font-medium">Breakdown</h4>
            {data.map((item, index) => (
              <div key={item.position} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm">{item.position}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">€{item.value.toLocaleString()}M</div>
                  <div className="text-xs text-gray-500">{item.count} players</div>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>€{total.toLocaleString()}M</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TransferTrendsChartProps {
  data: Array<{
    month: string;
    transfers: number;
    totalValue: number;
    avgValue: number;
  }>;
  className?: string;
}

function TransferTrendsChart({ data, className = "" }: TransferTrendsChartProps) {
  const [view, setView] = useState<'transfers' | 'value'>('transfers');

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Transfer Trends
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={view === 'transfers' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('transfers')}
            >
              Transfers
            </Button>
            <Button
              variant={view === 'value' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('value')}
            >
              Value
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {view === 'transfers' ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="transfers" 
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${Number(value).toLocaleString()}M`, 'Total Value']} />
              <Line 
                type="monotone" 
                dataKey="totalValue" 
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface ChartGridProps {
  charts: Array<{
    id: string;
    title: string;
    component: React.ReactNode;
    span?: 1 | 2;
  }>;
  className?: string;
}

function ChartGrid({ charts, className = "" }: ChartGridProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {charts.map(chart => (
        <div 
          key={chart.id}
          className={chart.span === 2 ? 'lg:col-span-2' : ''}
        >
          {chart.component}
        </div>
      ))}
    </div>
  );
}

export {
  TeamPerformanceChart,
  LeagueComparisonChart,
  PlayerRadarChart,
  MarketValueDistribution,
  TransferTrendsChart,
  ChartGrid
}