package com.example.todo.controller;

import com.example.todo.model.Leave;
import com.example.todo.repository.LeaveRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveRepository leaveRepository;

    public LeaveController(LeaveRepository leaveRepository) {
        this.leaveRepository = leaveRepository;
    }

    @GetMapping
    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Leave> getLeaveById(@PathVariable Long id) {
        return leaveRepository.findById(id);
    }

    @GetMapping("/employee/{employeeId}")
    public List<Leave> getLeavesByEmployee(@PathVariable Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId);
    }

    @GetMapping("/employee/{employeeId}/range")
    public List<Leave> getLeavesByEmployeeAndDateRange(
            @PathVariable Long employeeId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return leaveRepository.findByEmployeeIdAndStartDateBetween(employeeId, start, end);
    }

    @GetMapping("/status/{status}")
    public List<Leave> getLeavesByStatus(@PathVariable String status) {
        return leaveRepository.findByStatus(status);
    }

    @PostMapping
    public Leave createLeave(@RequestBody Leave leave) {
        if (leave.getStatus() == null) {
            leave.setStatus("PENDING");
        }
        return leaveRepository.save(leave);
    }

    @PutMapping("/{id}")
    public Optional<Leave> updateLeave(@PathVariable Long id, @RequestBody Leave leaveDetails) {
        return leaveRepository.findById(id).map(leave -> {
            if (leaveDetails.getStartDate() != null) {
                leave.setStartDate(leaveDetails.getStartDate());
            }
            if (leaveDetails.getEndDate() != null) {
                leave.setEndDate(leaveDetails.getEndDate());
            }
            if (leaveDetails.getReason() != null) {
                leave.setReason(leaveDetails.getReason());
            }
            if (leaveDetails.getStatus() != null) {
                leave.setStatus(leaveDetails.getStatus());
            }
            return leaveRepository.save(leave);
        });
    }

    @DeleteMapping("/{id}")
    public String deleteLeave(@PathVariable Long id) {
        if (leaveRepository.existsById(id)) {
            leaveRepository.deleteById(id);
            return "Leave request deleted successfully";
        }
        return "Leave request not found";
    }
}
