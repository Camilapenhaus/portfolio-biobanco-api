// Resolve a URL base da API.
// Prioridade: variável BASE_URL passada com -e na linha de comando;
// se não for informada, usa o baseURL do arquivo config/config.local.json.
const configLocal = JSON.parse(open('../config/config.local.json'));

export function pegarBaseURL() {
  return __ENV.BASE_URL || configLocal.baseURL;
}
