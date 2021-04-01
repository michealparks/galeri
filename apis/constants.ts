export const API_KEYS = [
	'wikipedia',
	'met',
	'rijks'
]

export const ENDPOINTS = {
	metCollection: 'https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11|21',
	metObject: 'https://collectionapi.metmuseum.org/public/collection/v1/objects',
	rijks: 'https://www.rijksmuseum.nl/api/en/collection?format=json&ps=30&imgonly=True&type=painting&key=1KfM6MpD',
	wikipedia: 'https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=Wikipedia:Featured_pictures/Artwork/Paintings&format=json&origin=*'
}
