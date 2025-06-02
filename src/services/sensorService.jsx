// src/services/sensorService.jsx

import { fetchWithAuth } from './api';

// ==== Cloud API Requests (backend routes) ====

export const fetchSensorData = async (plantId) =>
  fetchWithAuth(`/plants/${plantId}/sensors/current`);

export const fetchBackendSensorHistory = async (plantId, options = {}) => {
  const { startDate, endDate, interval } = options;
  let url = `/plants/${plantId}/sensors/history`;

  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate.toISOString());
  if (endDate) params.append('endDate', endDate.toISOString());
  if (interval) params.append('interval', interval);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  return fetchWithAuth(url);
};

export const calculateHealthMetrics = async (plantId) =>
  fetchWithAuth(`/plants/${plantId}/health-metrics`);

export const predictCareSchedule = async (plantId) =>
  fetchWithAuth(`/plants/${plantId}/care-predictions`);

export const getSoilMoistureDepletion = async (plantId) =>
  fetchWithAuth(`/plants/${plantId}/moisture-depletion`);

// ==== Google Sheets Sensor History (fallback for real data logging) ====

const SHEET_ID = '1kRgZwsISHOaA0EtDxQPibWbpdy-TMQnD7nsmjhAXNWo';
const SHEET_NAME = 'Basil Logger';

const parseGoogleSheetJSON = (text) => {
  const jsonStart = text.indexOf('(') + 1;
  const jsonEnd = text.lastIndexOf(')');
  const jsonString = text.substring(jsonStart, jsonEnd);
  return JSON.parse(jsonString);
};

const parseSensorRows = (rows) =>
  rows
    .map(row => {
      const cells = row.c || [];
      const [timestampCell, moistureCell, temperatureCell, humidityCell] = cells;

      if (
        !timestampCell || typeof timestampCell.v !== 'string' ||
        !moistureCell || isNaN(Number(moistureCell.v)) ||
        !temperatureCell || isNaN(Number(temperatureCell.v)) ||
        !humidityCell || isNaN(Number(humidityCell.v))
      ) {
        return null;
      }

      const timestamp = new Date(timestampCell.v);
      if (isNaN(timestamp.getTime())) return null;

      return {
        timestamp,
        soilMoisture: Number(moistureCell.v),
        temperature: Number(temperatureCell.v),
        humidity: Number(humidityCell.v),
        light: 65,
      };
    })
    .filter(row => row !== null);

export const fetchSensorHistory = async () => {
  const urls = [
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`,
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=0`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
      const text = await response.text();
      const json = parseGoogleSheetJSON(text);

      if (!json.table || !json.table.rows) throw new Error('No table data in response');

      return parseSensorRows(json.table.rows);
    } catch (err) {
      console.error(`Fetch attempt failed for URL: ${url}`, err);
    }
  }

  return []; // fallback in case both attempts fail
};
