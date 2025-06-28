import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Trophy,
  MapPin,
  Calendar,
  Building,
  DollarSign,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Star,
  ExternalLink
} from "lucide-react";
import { TrendIndicator, StatusBadge, ConfidenceMeter } from "./interactive-elements";
import { cn } from "@/lib/utils";

interface TeamCardProps {
  team: {
    id: number;
    name: string;
    league: string;
    logoUrl?: string;
    position?: number;
    points?: number;
    wins?: number;
    draws?: number;
    losses?: number;
    goalDifference?: number;
    form?: string[];
    marketValue?: number;
    stadium?: string;
    manager?: string;
  };
  view?: 'compact' | 'detailed' | 'minimal';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

function TeamCard({ team, view = 'compact', interactive = true, onClick, className = "" }: TeamCardProps) {
  const getPositionChange = () => {
    // Simulate position change for demo
    const change = Math.floor(Math.random() * 5) - 2;
    return change;
  };

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500';
      case 'L': return 'bg-red-500';
      case 'D': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const positionChange = getPositionChange();

  if (view === 'minimal') {
    return (
      <Card 
        className={cn(
          "transition-all duration-200",
          interactive && "hover:shadow-md cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              {team.logoUrl && (
                <img 
                  src={team.logoUrl} 
                  alt={`${team.name} logo`}
                  className="w-6 h-6 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div>
                <div className="font-medium text-sm">{team.name}</div>
                <div className="text-xs text-gray-500">{team.league}</div>
              </div>
            </div>
            {team.points !== undefined && (
              <div className="text-right">
                <div className="font-bold">{team.points}</div>
                <div className="text-xs text-gray-500">pts</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (view === 'compact') {
    return (
      <Card 
        className={cn(
          "transition-all duration-200",
          interactive && "hover:shadow-md hover:scale-105 cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                {team.position && (
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-lg">{team.position}</span>
                    {positionChange !== 0 && (
                      <div className={cn(
                        "text-xs",
                        positionChange > 0 ? "text-red-500" : "text-green-500"
                      )}>
                        {positionChange > 0 ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                      </div>
                    )}
                  </div>
                )}
                {team.logoUrl && (
                  <img 
                    src={team.logoUrl} 
                    alt={`${team.name} logo`}
                    className="w-8 h-8 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-gray-500">{team.league}</div>
                </div>
              </div>
              {team.points !== undefined && (
                <div className="text-right">
                  <div className="font-bold text-xl">{team.points}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="font-medium text-green-600">{team.wins || 0}</div>
                <div className="text-xs text-gray-500">W</div>
              </div>
              <div>
                <div className="font-medium text-yellow-600">{team.draws || 0}</div>
                <div className="text-xs text-gray-500">D</div>
              </div>
              <div>
                <div className="font-medium text-red-600">{team.losses || 0}</div>
                <div className="text-xs text-gray-500">L</div>
              </div>
            </div>

            {team.form && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 mr-2">Form:</span>
                {team.form.slice(-5).map((result, i) => (
                  <div 
                    key={i}
                    className={cn("w-4 h-4 rounded text-white text-xs flex items-center justify-center", getFormColor(result))}
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed view
  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        interactive && "hover:shadow-lg cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {team.logoUrl && (
              <img 
                src={team.logoUrl} 
                alt={`${team.name} logo`}
                className="w-12 h-12 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div>
              <CardTitle className="text-lg">{team.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{team.league}</span>
                {team.position && (
                  <>
                    <span>•</span>
                    <span>#{team.position}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="font-bold text-2xl text-green-600">{team.wins || 0}</div>
            <div className="text-xs text-gray-500">Wins</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-yellow-600">{team.draws || 0}</div>
            <div className="text-xs text-gray-500">Draws</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-red-600">{team.losses || 0}</div>
            <div className="text-xs text-gray-500">Losses</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl">{team.points || 0}</div>
            <div className="text-xs text-gray-500">Points</div>
          </div>
        </div>

        {team.goalDifference !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Goal Difference</span>
            <TrendIndicator 
              value={team.goalDifference} 
              format="number"
              size="sm"
            />
          </div>
        )}

        {team.marketValue && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Market Value</span>
            <span className="font-medium">€{(team.marketValue / 1000000).toFixed(0)}M</span>
          </div>
        )}

        {team.stadium && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Building className="h-4 w-4" />
            <span>{team.stadium}</span>
          </div>
        )}

        {team.manager && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{team.manager}</span>
          </div>
        )}

        {team.form && (
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Recent Form</div>
            <div className="flex items-center gap-1">
              {team.form.slice(-5).map((result, i) => (
                <div 
                  key={i}
                  className={cn("w-6 h-6 rounded text-white text-xs flex items-center justify-center font-medium", getFormColor(result))}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PlayerCardProps {
  player: {
    id: number;
    name: string;
    position: string;
    age: number;
    nationality: string;
    team: string;
    marketValue?: number;
    rating?: number;
    goals?: number;
    assists?: number;
    appearances?: number;
    photoUrl?: string;
  };
  view?: 'compact' | 'detailed' | 'minimal';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

function PlayerCard({ player, view = 'compact', interactive = true, onClick, className = "" }: PlayerCardProps) {
  if (view === 'minimal') {
    return (
      <Card 
        className={cn(
          "transition-all duration-200",
          interactive && "hover:shadow-md cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {player.photoUrl && (
              <img 
                src={player.photoUrl} 
                alt={player.name}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/32/32';
                }}
              />
            )}
            <div className="flex-1">
              <div className="font-medium text-sm">{player.name}</div>
              <div className="text-xs text-gray-500">{player.position} • {player.team}</div>
            </div>
            {player.rating && (
              <div className="text-right">
                <div className="font-bold text-sm">{player.rating.toFixed(1)}</div>
                <div className="text-xs text-gray-500">rating</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (view === 'compact') {
    return (
      <Card 
        className={cn(
          "transition-all duration-200",
          interactive && "hover:shadow-md hover:scale-105 cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {player.photoUrl && (
                <img 
                  src={player.photoUrl} 
                  alt={player.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/api/placeholder/48/48';
                  }}
                />
              )}
              <div className="flex-1">
                <div className="font-medium">{player.name}</div>
                <div className="text-sm text-gray-500">{player.position}</div>
                <div className="text-xs text-gray-500">{player.team}</div>
              </div>
              {player.rating && (
                <div className="text-center">
                  <div className="font-bold text-lg">{player.rating.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">rating</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="font-medium">{player.goals || 0}</div>
                <div className="text-xs text-gray-500">Goals</div>
              </div>
              <div>
                <div className="font-medium">{player.assists || 0}</div>
                <div className="text-xs text-gray-500">Assists</div>
              </div>
              <div>
                <div className="font-medium">{player.appearances || 0}</div>
                <div className="text-xs text-gray-500">Apps</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Age: {player.age}</span>
              <span className="text-gray-500">{player.nationality}</span>
            </div>

            {player.marketValue && (
              <div className="text-center">
                <div className="font-bold text-green-600">
                  €{(player.marketValue / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-gray-500">Market Value</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed view
  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        interactive && "hover:shadow-lg cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          {player.photoUrl && (
            <img 
              src={player.photoUrl} 
              alt={player.name}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/api/placeholder/64/64';
              }}
            />
          )}
          <div className="flex-1">
            <CardTitle className="text-lg">{player.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Badge variant="outline">{player.position}</Badge>
              <span>•</span>
              <span>{player.team}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span>Age: {player.age}</span>
              <span>{player.nationality}</span>
            </div>
          </div>
          {player.rating && (
            <div className="text-center">
              <div className="font-bold text-2xl">{player.rating.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Overall Rating</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="font-bold text-xl text-blue-600">{player.goals || 0}</div>
            <div className="text-xs text-gray-500">Goals</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-green-600">{player.assists || 0}</div>
            <div className="text-xs text-gray-500">Assists</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl">{player.appearances || 0}</div>
            <div className="text-xs text-gray-500">Appearances</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-purple-600">
              {player.goals && player.assists ? (player.goals + player.assists) : 0}
            </div>
            <div className="text-xs text-gray-500">G+A</div>
          </div>
        </div>

        {player.marketValue && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Market Value</span>
              <span className="font-bold text-green-600">
                €{(player.marketValue / 1000000).toFixed(1)}M
              </span>
            </div>
            <Progress 
              value={(player.marketValue / 200000000) * 100} 
              className="h-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TransferCardProps {
  transfer: {
    id: number;
    player: string;
    fromTeam: string;
    toTeam: string;
    fee?: number;
    status: 'rumor' | 'negotiating' | 'agreed' | 'completed';
    reliability?: number;
    source?: string;
    timestamp: Date;
  };
  view?: 'compact' | 'detailed';
  className?: string;
}

function TransferCard({ transfer, view = 'compact', className = "" }: TransferCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'agreed': return 'text-blue-600 bg-blue-100';
      case 'negotiating': return 'text-yellow-600 bg-yellow-100';
      case 'rumor': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(transfer.status)}>
              {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
            </Badge>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(transfer.timestamp)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="font-medium">{transfer.player}</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">{transfer.fromTeam}</span>
              <ArrowUpRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{transfer.toTeam}</span>
            </div>
          </div>

          {transfer.fee && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="font-medium text-green-600">
                €{(transfer.fee / 1000000).toFixed(1)}M
              </span>
            </div>
          )}

          {transfer.reliability && (
            <ConfidenceMeter 
              confidence={transfer.reliability} 
              label="Reliability"
              className="mt-2"
            />
          )}

          {transfer.source && (
            <div className="text-xs text-gray-500">
              Source: {transfer.source}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export {
  TeamCard,
  PlayerCard,
  TransferCard
}