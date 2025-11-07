package edu.gct.campusLink.service;

import java.util.Map;

public interface DashboardService {
    Map<String, Long> getSummaryStats();
    Map<String, Long> getWeeklyActivity();
}