package edu.gct.campusLink.controller;

import edu.gct.campusLink.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public Map<String, Long> getSummaryStats() {
        return dashboardService.getSummaryStats();
    }

    @GetMapping("/weekly")
    public Map<String, Long> getWeeklyActivity() {
        return dashboardService.getWeeklyActivity();
    }
}