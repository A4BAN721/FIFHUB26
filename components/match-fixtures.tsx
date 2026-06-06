"use client";

import { useState, useMemo } from "react";
import { matchFixtures, normalizeCountryName, Match } from "@/lib/match-fixtures";
import { nations } from "@/lib/world-cup-data";
import { useLanguage } from "./language-provider";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function MatchFixtures() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("ALL");

  const stages = useMemo(() => {
    const uniqueStages = Array.from(new Set(matchFixtures.map((m) => m.stage)));
    return ["ALL", ...uniqueStages];
  }, []);

  const filteredMatches = useMemo(() => {
    let matches = matchFixtures;

    if (selectedStage !== "ALL") {
      matches = matches.filter((m) => m.stage === selectedStage);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      matches = matches.filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(query) ||
          m.awayTeam.toLowerCase().includes(query) ||
          m.stadium.toLowerCase().includes(query) ||
          m.date.toLowerCase().includes(query)
      );
    }

    return matches;
  }, [search, selectedStage]);

  const matchesByStage = useMemo(() => {
    const grouped: Record<string, Match[]> = {};
    filteredMatches.forEach((match) => {
      if (!grouped[match.stage]) {
        grouped[match.stage] = [];
      }
      grouped[match.stage].push(match);
    });
    return grouped;
  }, [filteredMatches]);

  const getGroupStageMatchdays = (matches: Match[]) => {
    const matchday1 = matches.slice(0, 24);
    const matchday2 = matches.slice(24, 48);
    const matchday3 = matches.slice(48, 72);
    return [
      { name: "Matchday 1", matches: matchday1 },
      { name: "Matchday 2", matches: matchday2 },
      { name: "Matchday 3", matches: matchday3 },
    ];
  };

  const getNationId = (teamName: string): string | null => {
    if (teamName === "TBD") return null;
    const normalized = normalizeCountryName(teamName);
    const nation = nations.find((n) => n.id === normalized);
    return nation ? nation.id : null;
  };

  const getNationFlag = (teamName: string): string => {
    if (teamName === "TBD") return "❓";
    const nationId = getNationId(teamName);
    if (nationId) {
      const nation = nations.find((n) => n.id === nationId);
      return nation ? nation.flag : "🏳️";
    }
    return "🏳️";
  };

  const getNationColor = (teamName: string): string => {
    if (teamName === "TBD") return "#666";
    const nationId = getNationId(teamName);
    if (nationId) {
      const nation = nations.find((n) => n.id === nationId);
      return nation ? nation.jerseyColors.primary : "#666";
    }
    return "#666";
  };

  const getTranslatedTeamName = (teamName: string): string => {
    if (teamName === "TBD") return "TBD";
    const normalized = normalizeCountryName(teamName);
    const translationKey = normalized.replace(/-/g, "");
    return t(translationKey) || teamName;
  };

  const getTranslatedStage = (stage: string): string => {
    const stageMap: Record<string, string> = {
      "GROUP STAGE": t("groupStage"),
      "ROUND OF 32": t("roundOf32"),
      "ROUND OF 16": t("roundOf16"),
      "QUARTER-FINALS": t("quarterFinals"),
      "SEMI-FINALS": t("semiFinals"),
      "BRONZE FINAL": t("bronzeFinal"),
      "FINAL": t("final"),
    };
    return stageMap[stage] || stage;
  };

  const getCardBackgroundColor = () => {
    return theme === "dark" ? "rgba(30, 30, 35, 0.6)" : "rgba(255, 255, 255, 0.7)";
  };

  const getCardBorderColor = () => {
    return theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)";
  };

  const getTextShadowColor = () => {
    return theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)";
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search and Stage Filter */}
      <div className="mb-4 space-y-3">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchMatches")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card/80 backdrop-blur-sm border-border/50"
          />
        </div>

        {/* Stage Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedStage === stage
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/80 text-muted-foreground hover:bg-card"
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
          {t("matchFixtures")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("schedule")}
        </p>
      </div>

      {/* Matches by Stage */}
      <div className="space-y-6">
        {Object.entries(matchesByStage).map(([stage, matches], stageIndex) => {
          const isGroupStage = stage === "GROUP STAGE";
          
          if (isGroupStage) {
            const matchdays = getGroupStageMatchdays(matches);
            
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stageIndex * 0.02, duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    {getTranslatedStage("GROUP STAGE")}
                  </h3>
                  <div className="flex-1 h-px bg-border/50" />
                  <span className="text-xs text-muted-foreground">
                    {matches.length} {matches.length === 1 ? t("players") : t("players")}
                  </span>
                </div>

                {matchdays.map((matchday, mdIndex) => (
                  <div key={matchday.name} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="text-xs font-semibold text-muted-foreground">
                        {t("matchday")} {mdIndex + 1}
                      </h4>
                      <div className="flex-1 h-px bg-border/30" />
                      <span className="text-[10px] text-muted-foreground">
                        {matchday.matches.length} {matchday.matches.length === 1 ? t("players") : t("players")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {matchday.matches.map((match: Match, matchIndex: number) => {
                        const homeNationId = getNationId(match.homeTeam);
                        const awayNationId = getNationId(match.awayTeam);
                        const homeColor = getNationColor(match.homeTeam);
                        const awayColor = getNationColor(match.awayTeam);

                        return (
                          <motion.div
                            key={match.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: stageIndex * 0.02 + mdIndex * 0.01 + matchIndex * 0.005, duration: 0.2 }}
                          >
                            <Card 
                              className="group relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                              style={{
                                backgroundColor: getCardBackgroundColor(),
                                borderColor: getCardBorderColor()
                              }}
                            >
                              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),transparent_15%),radial-gradient(circle_at_bottom_right,_rgba(0,0,0,0.03),transparent_20%)]" />
                              
                              <div className="relative p-3">
                                {/* Group name at top right for Group Stage */}
                                <div className="absolute top-2 right-2">
                                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    {match.group}
                                  </span>
                                </div>

                                {/* Date and Time for Group Stage */}
                                <div className="flex items-center justify-center mb-2 pt-4">
                                  <span className="text-[10px] text-muted-foreground">
                                    {match.date} • {match.time}
                                  </span>
                                </div>

                                {/* Teams - Horizontal Layout */}
                                <div className="flex items-center justify-between gap-2">
                                  {/* Home Team */}
                                  <div className="flex-1">
                                    {homeNationId ? (
                                      <button
                                        onClick={() => {
                                          window.dispatchEvent(
                                            new CustomEvent("nationSelected", { detail: homeNationId })
                                          );
                                        }}
                                        className="flex items-center gap-2 w-full"
                                        style={{ ['--team-color' as any]: homeColor, ['--shadow-color' as any]: getTextShadowColor() }}
                                      >
                                        <span className="text-xl">{getNationFlag(match.homeTeam)}</span>
                                        <span className="text-xs font-semibold text-foreground">
                                          <span className="hover:text-[var(--team-color)] transition-colors cursor-pointer hover:drop-shadow-[0_0_2px_var(--shadow-color)]">
                                            {match.homeTeam}
                                          </span>
                                        </span>
                                      </button>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xl">{getNationFlag(match.homeTeam)}</span>
                                        <span className="text-xs font-semibold text-muted-foreground">
                                          {match.homeTeam}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* VS */}
                                  <div className="text-muted-foreground font-bold text-xs px-1">
                                    VS
                                  </div>

                                  {/* Away Team */}
                                  <div className="flex-1">
                                    {awayNationId ? (
                                      <button
                                        onClick={() => {
                                          window.dispatchEvent(
                                            new CustomEvent("nationSelected", { detail: awayNationId })
                                          );
                                        }}
                                        className="flex items-center gap-2 w-full justify-end"
                                        style={{ ['--team-color' as any]: awayColor, ['--shadow-color' as any]: getTextShadowColor() }}
                                      >
                                        <span className="text-xs font-semibold text-foreground">
                                          <span className="hover:text-[var(--team-color)] transition-colors cursor-pointer hover:drop-shadow-[0_0_2px_var(--shadow-color)]">
                                            {match.awayTeam}
                                          </span>
                                        </span>
                                        <span className="text-xl">{getNationFlag(match.awayTeam)}</span>
                                      </button>
                                    ) : (
                                      <div className="flex items-center gap-2 justify-end">
                                        <span className="text-xs font-semibold text-muted-foreground">
                                          {match.awayTeam}
                                        </span>
                                        <span className="text-xl">{getNationFlag(match.awayTeam)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Stadium */}
                                <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2 pt-2 border-t border-border/20">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{match.stadium}</span>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            );
          }
          
          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stageIndex * 0.02, duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {getTranslatedStage(stage)}
                </h3>
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-muted-foreground">
                  {matches.length} {matches.length === 1 ? t("players") : t("players")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {matches.map((match: Match, matchIndex: number) => {
                  const homeNationId = getNationId(match.homeTeam);
                  const awayNationId = getNationId(match.awayTeam);
                  const homeColor = getNationColor(match.homeTeam);
                  const awayColor = getNationColor(match.awayTeam);

                  return (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: stageIndex * 0.02 + matchIndex * 0.01, duration: 0.2 }}
                    >
                      <Card 
                        className="group relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        style={{
                          backgroundColor: getCardBackgroundColor(),
                          borderColor: getCardBorderColor()
                        }}
                      >
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),transparent_15%),radial-gradient(circle_at_bottom_right,_rgba(0,0,0,0.03),transparent_20%)]" />
                        
                        <div className="relative p-3">
                          {/* Header: Time and Info */}
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/20">
                            <span className="text-xs font-semibold text-muted-foreground">{match.time}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {match.date}
                            </span>
                          </div>

                          {/* Teams - Horizontal Layout */}
                          <div className="flex items-center justify-between gap-2">
                            {/* Home Team */}
                            <div className="flex-1">
                              {homeNationId ? (
                                <button
                                  onClick={() => {
                                    window.dispatchEvent(
                                      new CustomEvent("nationSelected", { detail: homeNationId })
                                    );
                                  }}
                                  className="flex items-center gap-2 w-full"
                                  style={{ ['--team-color' as any]: homeColor, ['--shadow-color' as any]: getTextShadowColor() }}
                                >
                                  <span className="text-xl">{getNationFlag(match.homeTeam)}</span>
                                  <span className="text-xs font-semibold text-foreground">
                                    <span className="hover:text-[var(--team-color)] transition-colors cursor-pointer hover:drop-shadow-[0_0_2px_var(--shadow-color)]">
                                      {getTranslatedTeamName(match.homeTeam)}
                                    </span>
                                  </span>
                                </button>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{getNationFlag(match.homeTeam)}</span>
                                  <span className="text-xs font-semibold text-muted-foreground">
                                    {getTranslatedTeamName(match.homeTeam)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* VS */}
                            <div className="text-muted-foreground font-bold text-xs px-1">
                              {t("vs")}
                            </div>

                            {/* Away Team */}
                            <div className="flex-1">
                              {awayNationId ? (
                                <button
                                  onClick={() => {
                                    window.dispatchEvent(
                                      new CustomEvent("nationSelected", { detail: awayNationId })
                                    );
                                  }}
                                  className="flex items-center gap-2 w-full justify-end"
                                  style={{ ['--team-color' as any]: awayColor, ['--shadow-color' as any]: getTextShadowColor() }}
                                >
                                  <span className="text-xs font-semibold text-foreground">
                                    <span className="hover:text-[var(--team-color)] transition-colors cursor-pointer hover:drop-shadow-[0_0_2px_var(--shadow-color)]">
                                      {getTranslatedTeamName(match.awayTeam)}
                                    </span>
                                  </span>
                                  <span className="text-xl">{getNationFlag(match.awayTeam)}</span>
                                </button>
                              ) : (
                                <div className="flex items-center gap-2 justify-end">
                                  <span className="text-xs font-semibold text-muted-foreground">
                                    {getTranslatedTeamName(match.awayTeam)}
                                  </span>
                                  <span className="text-xl">{getNationFlag(match.awayTeam)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Stadium */}
                          <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2 pt-2 border-t border-border/20">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{match.stadium}</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No matches found</p>
        </div>
      )}
    </div>
  );
}
