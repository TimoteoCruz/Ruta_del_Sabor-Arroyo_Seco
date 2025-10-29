import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métrica personalizada para rastrear errores
const errorRate = new Rate('errors');

// Configuración de la prueba
export const options = {
  stages: [
    { duration: '10s', target: 50 },  // Ramp-up: incrementa a 50 usuarios en 10s
    { duration: '40s', target: 1000 },  // Carga sostenida: mantiene 1000 usuarios por 40s
    { duration: '10s', target: 0 },   // Ramp-down: reduce a 0 usuarios en 10s
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% de las peticiones deben completarse en menos de 500ms
    http_req_failed: ['rate<0.1'],     // Menos del 10% de peticiones pueden fallar
    errors: ['rate<0.1'],              // Menos del 10% de errores
  },
  // Configuración para Grafana Cloud
  cloud: {
    name: 'Ruta del Sabor - Prueba de Carga',
    projectID: 3796716,
  },
};

// URL base de la aplicación
const BASE_URL = 'https://ruta-del-sabor-arroyo-seco-one.vercel.app';

// Función principal de prueba
export default function () {
  // Test 1: Página Principal
  let response1 = http.get(`${BASE_URL}/`);
  
  // Verificar que la respuesta sea exitosa
  let checkRes1 = check(response1, {
    'Home - Status es 200': (r) => r.status === 200,
    'Home - Tiempo de respuesta < 2s': (r) => r.timings.duration < 2000,
  });
  
  // Registrar errores
  errorRate.add(!checkRes1);
  
  // Simular tiempo de lectura del usuario (1-2 segundos)
  sleep(Math.random() * 1 + 1);
  
  // Test 2: Sección de Gastronomía
  let response2 = http.get(`${BASE_URL}/gastronomia`);
  
  let checkRes2 = check(response2, {
    'Gastronomía - Status es 200': (r) => r.status === 200,
    'Gastronomía - Tiempo de respuesta < 2s': (r) => r.timings.duration < 2000,
  });
  
  errorRate.add(!checkRes2);
  
  sleep(Math.random() * 1 + 1);
  
  // Test 3: Sección de Recetas
  let response3 = http.get(`${BASE_URL}/gastronomia/recetas`);
  
  let checkRes3 = check(response3, {
    'Recetas - Status es 200': (r) => r.status === 200,
    'Recetas - Tiempo de respuesta < 2s': (r) => r.timings.duration < 2000,
  });
  
  errorRate.add(!checkRes3);
  
  sleep(Math.random() * 1 + 1);
  
  // Test 4: Sección de Ubicaciones
  let response4 = http.get(`${BASE_URL}/ubicaciones`);
  
  let checkRes4 = check(response4, {
    'Ubicaciones - Status es 200': (r) => r.status === 200,
    'Ubicaciones - Tiempo de respuesta < 2s': (r) => r.timings.duration < 2000,
  });
  
  errorRate.add(!checkRes4);
  
  sleep(Math.random() * 1 + 1);
}

// Función que se ejecuta al finalizar las pruebas
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const indent = (options && options.indent) || '';
  const enableColors = (options && options.enableColors) || false;
  
  let summary = `\n${indent}Resumen de Pruebas de Carga - Ruta del Sabor\n`;
  summary += `${indent}${'='.repeat(50)}\n\n`;
  
  const metrics = data.metrics;
  
  summary += `${indent}📊 Métricas Generales:\n`;
  summary += `${indent}  • Total de peticiones: ${(metrics.http_reqs && metrics.http_reqs.values.count) || 0}\n`;
  summary += `${indent}  • Peticiones exitosas: ${((metrics.http_reqs && metrics.http_reqs.values.count) || 0) - ((metrics.http_req_failed && metrics.http_req_failed.values.passes) || 0)}\n`;
  summary += `${indent}  • Peticiones fallidas: ${(metrics.http_req_failed && metrics.http_req_failed.values.passes) || 0}\n`;
  summary += `${indent}  • Tasa de error: ${(((metrics.errors && metrics.errors.values.rate) || 0) * 100).toFixed(2)}%\n\n`;
  
  summary += `${indent}⏱️  Tiempos de Respuesta:\n`;
  summary += `${indent}  • Promedio: ${((metrics.http_req_duration && metrics.http_req_duration.values.avg) || 0).toFixed(2)}ms\n`;
  summary += `${indent}  • Mínimo: ${((metrics.http_req_duration && metrics.http_req_duration.values.min) || 0).toFixed(2)}ms\n`;
  summary += `${indent}  • Máximo: ${((metrics.http_req_duration && metrics.http_req_duration.values.max) || 0).toFixed(2)}ms\n`;
  summary += `${indent}  • Percentil 95: ${((metrics.http_req_duration && metrics.http_req_duration.values['p(95)']) || 0).toFixed(2)}ms\n\n`;
  
  summary += `${indent}👥 Usuarios Virtuales:\n`;
  summary += `${indent}  • Usuarios simultáneos máximos: ${(metrics.vus_max && metrics.vus_max.values.value) || 0}\n\n`;
  
  return summary;
}
