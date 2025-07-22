export function getStreamUrl(item, type, credentials) {
  // Si direct_source existe et non vide, retourne ça (ex: URL direct)
  if (item.direct_source && item.direct_source.length > 0) {
    return item.direct_source;
  }

  // Sinon construit l'URL custom avec le serveur, username, password et stream_id
  if (credentials?.username && credentials?.password && item.stream_id) {
    // Ex : remplacer "server.iptv:8080" par ta vraie base URL, que tu peux mettre en paramètre ou config
    const serverBase = "http://play.premium-ott.tv:8080";
    return `${serverBase}/live/${credentials.username}/${credentials.password}/${item.stream_id}.ext`;
  }

  return ''; 
}
