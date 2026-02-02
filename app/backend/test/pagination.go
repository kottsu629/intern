package pagination

// calcTotalPages は総件数と1ページあたり件数から
// 必要なページ数を計算する
func calcTotalPages(totalCount int, perPage int) int {
	if totalCount <= 0 || perPage <= 0 {
		return 0
	}

	pages := totalCount / perPage
	if totalCount%perPage != 0 {
		pages++
	}
	return pages
}
