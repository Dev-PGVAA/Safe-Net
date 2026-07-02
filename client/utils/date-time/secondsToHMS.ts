export function secondsToHMS(seconds: number): string {
	if (isNaN(seconds)) {
		return 'Invalid time'
	}

	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const remainingSeconds = seconds % 60

	if (hours > 0) {
		return `${hours}h ${minutes.toString().padStart(2, '0')}m ${remainingSeconds.toString().padStart(2, '0')}s`
	} else if (minutes > 0) {
		return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`
	} else {
		return `${remainingSeconds}s`
	}
}
