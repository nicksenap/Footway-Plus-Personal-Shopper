import { NextResponse } from 'next/server';

interface FilterValue {
  name: string;
  count: number;
}

interface MerchantValue extends FilterValue {
  id: string;
}

interface FilterGroup {
  total: number;
  values: FilterValue[];
}

interface MerchantGroup {
  total: number;
  values: MerchantValue[];
}

export interface AvailableFilters {
  totalItems: number;
  merchants: MerchantGroup;
  vendors: FilterGroup;
  departments: FilterGroup;
  productGroups: FilterGroup;
  productTypes: FilterGroup;
}

export async function GET() {
  try {
    const response = await fetch(
      'https://api.footwayplus.com/v1/inventory/availableFilters',
      {
        method: "GET",
        headers: {
          "X-API-KEY": process.env.FOOTWAY_API_KEY as string,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching filters: ${response.statusText}`);
    }

    const data: AvailableFilters = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    );
  }
}
