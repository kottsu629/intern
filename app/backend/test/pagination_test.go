package pagination

import "testing"

func TestCalcTotalPages(t *testing.T) {
	tests := []struct {
		name       string
		totalCount int
		perPage    int
		expected   int
	}{
		{"exact division", 20, 10, 2},
		{"round up", 21, 10, 3},
		{"zero total", 0, 10, 0},
		{"perPage zero", 10, 0, 0},
		{"perPage greater than total", 5, 10, 1},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := calcTotalPages(tt.totalCount, tt.perPage)
			if result != tt.expected {
				t.Errorf(
					"calcTotalPages(%d, %d) = %d, want %d",
					tt.totalCount,
					tt.perPage,
					result,
					tt.expected,
				)
			}
		})
	}
}
