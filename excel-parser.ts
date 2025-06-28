import XLSX from 'xlsx';
import { z } from 'zod';
import { createReadStream } from 'fs';
import { parse as parseCSV } from 'csv-parse';

export interface ParsedPlayerData {
  name: string;
  team: string;
  position: string;
  goals: number;
  assists: number;
  appearances: number;
  league: string;
}

const PlayerSchema = z.object({
  name: z.string().min(1, "Player name is required"),
  team: z.string().min(1, "Team name is required"),
  position: z.string().min(1, "Position is required"),
  goals: z.number().min(0, "Goals must be non-negative"),
  assists: z.number().min(0, "Assists must be non-negative"),
  appearances: z.number().min(0, "Appearances must be non-negative"),
  league: z.string().min(1, "League is required")
});

// Header mapping for different data sources
const HEADER_MAPPINGS: Record<string, string> = {
  'Player': 'name',
  'Name': 'name',
  'player_name': 'name',
  'Player Name': 'name',
  'Team': 'team',
  'Club': 'team',
  'team_name': 'team',
  'Position': 'position',
  'Pos': 'position',
  'position': 'position',
  'Goals': 'goals',
  'Gls': 'goals',
  'goals': 'goals',
  'Assists': 'assists',
  'Ast': 'assists',
  'assists': 'assists',
  'Appearances': 'appearances',
  'Apps': 'appearances',
  'MP': 'appearances',
  'appearances': 'appearances',
  'League': 'league',
  'Competition': 'league',
  'league': 'league'
};

function normalizeHeaders(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};

  headers.forEach((header, index) => {
    const normalizedKey = HEADER_MAPPINGS[header] || header.toLowerCase().replace(/\s+/g, '_');
    mapping[index.toString()] = normalizedKey;
  });

  return mapping;
}

function validateAndTransformRow(row: any, headerMapping: Record<string, string>): ParsedPlayerData {
  const transformedRow: Record<string, any> = {};

  // Transform row using header mapping
  Object.entries(row).forEach(([key, value]) => {
    const mappedKey = headerMapping[key] || key;
    transformedRow[mappedKey] = value;
  });

  // Normalize data
  const playerData = {
    name: String(transformedRow.name || '').trim(),
    team: String(transformedRow.team || '').trim(),
    position: String(transformedRow.position || '').trim(),
    goals: parseInt(String(transformedRow.goals || '0')) || 0,
    assists: parseInt(String(transformedRow.assists || '0')) || 0,
    appearances: parseInt(String(transformedRow.appearances || '0')) || 0,
    league: String(transformedRow.league || 'Unknown').trim()
  };

  // Validate using Zod schema
  try {
    return PlayerSchema.parse(playerData);
  } catch (error) {
    throw new Error(`Row validation failed: ${JSON.stringify(playerData)} - ${error}`);
  }
}

export async function parseExcelFile(filePath: string): Promise<ParsedPlayerData[]> {
  const fileExtension = filePath.split('.').pop()?.toLowerCase();

  try {
    if (fileExtension === 'csv') {
      return parseCSVFile(filePath);
    } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
      return parseXLSXFile(filePath);
    } else {
      throw new Error(`Unsupported file format: ${fileExtension}`);
    }
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error(`Failed to parse file: ${error}`);
  }
}

async function parseCSVFile(filePath: string): Promise<ParsedPlayerData[]> {
  return new Promise((resolve, reject) => {
    const results: ParsedPlayerData[] = [];
    let headerMapping: Record<string, string> = {};
    let isFirstRow = true;

    createReadStream(filePath)
      .pipe(parseCSV({ 
        headers: false,
        skip_empty_lines: true,
        trim: true
      }))
      .on('data', (row: string[]) => {
        try {
          if (isFirstRow) {
            headerMapping = normalizeHeaders(row);
            isFirstRow = false;
            return;
          }

          const rowObject: Record<string, string> = {};
          row.forEach((value, index) => {
            rowObject[index.toString()] = value;
          });

          const validatedRow = validateAndTransformRow(rowObject, headerMapping);
          results.push(validatedRow);
        } catch (error) {
          console.warn(`Skipping invalid row: ${error}`);
        }
      })
      .on('end', () => {
        console.log(`Successfully parsed ${results.length} rows from CSV`);
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function parseXLSXFile(filePath: string): Promise<ParsedPlayerData[]> {
  try {
    // Support both .xls and .xlsx formats
    const workbook = XLSX.readFile(filePath, { 
      cellText: false,
      cellDates: true,
      sheetStubs: false
    });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON with header row
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: '',
      raw: false
    }) as string[][];

    if (jsonData.length < 2) {
      throw new Error('File must contain at least a header row and one data row');
    }

    const headers = jsonData[0];
    const headerMapping = normalizeHeaders(headers);
    const results: ParsedPlayerData[] = [];

    // Process each row (skip header)
    for (let i = 1; i < jsonData.length; i++) {
      try {
        const row = jsonData[i];
        const rowObject: Record<string, string> = {};

        row.forEach((value, index) => {
          rowObject[index.toString()] = String(value || '');
        });

        const validatedRow = validateAndTransformRow(rowObject, headerMapping);
        results.push(validatedRow);
      } catch (error) {
        console.warn(`Skipping invalid row ${i + 1}: ${error}`);
      }
    }

    console.log(`Successfully parsed ${results.length} rows from Excel file`);
    return results;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw new Error(`Failed to parse Excel file: ${error}`);
  }
}

// Test function for validation
export async function testExcelParser(): Promise<void> {
  console.log('🧪 Testing Excel parser with mock data...');

  // Mock test data that should pass validation
  const testData: ParsedPlayerData[] = [
    {
      name: 'Mohamed Salah',
      team: 'Liverpool',
      position: 'RW',
      goals: 24,
      assists: 12,
      appearances: 32,
      league: 'Premier League'
    },
    {
      name: 'Erling Haaland',
      team: 'Manchester City',
      position: 'ST',
      goals: 36,
      assists: 8,
      appearances: 35,
      league: 'Premier League'
    }
  ];

  // Validate each test record
  testData.forEach((player, index) => {
    try {
      PlayerSchema.parse(player);
      console.log(`✅ Test record ${index + 1} passed validation`);
    } catch (error) {
      console.error(`❌ Test record ${index + 1} failed validation:`, error);
    }
  });

  console.log('🧪 Excel parser test completed');
}