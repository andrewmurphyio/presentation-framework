import type { LayoutDefinition, LayoutZone } from '../types/layout';

/**
 * Layout composition utilities
 *
 * These utilities provide helper functions for combining, extending, and modifying
 * layout definitions. They are used internally by the LayoutResolver and
 * CustomLayoutBuilder but can also be used directly for advanced layout manipulation.
 */

/**
 * Merge multiple layouts into one, preserving all unique zones
 *
 * @param layouts - Array of layouts to merge
 * @param options - Merge options
 * @returns Merged layout definition
 */
export function mergeLayouts(
  layouts: LayoutDefinition[],
  options?: {
    name?: string;
    description?: string;
    conflictResolution?: 'first' | 'last';
  }
): LayoutDefinition {
  if (layouts.length === 0) {
    throw new Error('mergeLayouts requires at least one layout');
  }

  const conflictResolution = options?.conflictResolution || 'first';
  const zonesMap = new Map<string, LayoutZone>();

  // Collect all zones, handling conflicts based on resolution strategy
  for (const layout of layouts) {
    for (const zone of layout.zones) {
      if (conflictResolution === 'first' && zonesMap.has(zone.name)) {
        continue; // Skip if zone already exists (keep first)
      }
      zonesMap.set(zone.name, { ...zone }); // Clone zone to avoid mutations
    }
  }

  // Use first layout as base for grid properties, or last if conflict resolution is 'last'
  // We know layouts[0] exists because we check length > 0 above
  const baseLayoutIndex = conflictResolution === 'last' ? layouts.length - 1 : 0;
  const baseLayout = layouts[baseLayoutIndex];

  if (!baseLayout) {
    throw new Error('Invalid layout index'); // This should never happen given the length check
  }

  return {
    name: options?.name || `merged-${layouts.map(l => l.name).join('-')}`,
    description: options?.description || `Merged from: ${layouts.map(l => l.name).join(', ')}`,
    zones: Array.from(zonesMap.values()),
    gridTemplateAreas: baseLayout.gridTemplateAreas,
    gridTemplateColumns: baseLayout.gridTemplateColumns,
    gridTemplateRows: baseLayout.gridTemplateRows,
    customStyles: baseLayout.customStyles,
    source: baseLayout.source,
    priority: baseLayout.priority,
  };
}

/**
 * Extend a layout by adding, removing, or modifying zones
 *
 * @param baseLayout - The layout to extend
 * @param extensions - Extension configuration
 * @returns Extended layout definition
 */
export function extendLayout(
  baseLayout: LayoutDefinition,
  extensions: {
    name?: string;
    description?: string;
    addZones?: LayoutZone[];
    removeZones?: string[];
    modifyZones?: { [zoneName: string]: Partial<LayoutZone> };
    gridTemplateAreas?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    customStyles?: string;
  }
): LayoutDefinition {
  // Start with a copy of the base layout's zones
  let zones = baseLayout.zones.map(zone => ({ ...zone }));

  // Remove zones if specified
  if (extensions.removeZones && extensions.removeZones.length > 0) {
    zones = zones.filter(zone => !extensions.removeZones!.includes(zone.name));
  }

  // Modify zones if specified
  if (extensions.modifyZones) {
    zones = zones.map(zone => {
      const modifications = extensions.modifyZones![zone.name];
      if (modifications) {
        return { ...zone, ...modifications };
      }
      return zone;
    });
  }

  // Add new zones if specified
  if (extensions.addZones && extensions.addZones.length > 0) {
    for (const newZone of extensions.addZones) {
      // Check for duplicates
      if (zones.find(z => z.name === newZone.name)) {
        throw new Error(`Zone "${newZone.name}" already exists in the layout`);
      }
      zones.push({ ...newZone });
    }
  }

  return {
    name: extensions.name || `${baseLayout.name}-extended`,
    description: extensions.description || `Extended from ${baseLayout.name}`,
    zones,
    gridTemplateAreas: extensions.gridTemplateAreas || baseLayout.gridTemplateAreas,
    gridTemplateColumns: extensions.gridTemplateColumns || baseLayout.gridTemplateColumns,
    gridTemplateRows: extensions.gridTemplateRows || baseLayout.gridTemplateRows,
    customStyles: extensions.customStyles || baseLayout.customStyles,
    source: baseLayout.source,
    priority: baseLayout.priority,
  };
}

/**
 * Override specific zones in a layout while preserving others
 *
 * @param baseLayout - The layout to override
 * @param overrides - Override configuration
 * @returns Layout with overridden zones
 */
export function overrideLayout(
  baseLayout: LayoutDefinition,
  overrides: {
    name?: string;
    description?: string;
    zones?: { [zoneName: string]: LayoutZone };
    gridTemplateAreas?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    customStyles?: string;
  }
): LayoutDefinition {
  // Create a map of existing zones
  const zonesMap = new Map<string, LayoutZone>();
  for (const zone of baseLayout.zones) {
    zonesMap.set(zone.name, { ...zone });
  }

  // Override or add zones
  if (overrides.zones) {
    for (const [zoneName, zoneDefinition] of Object.entries(overrides.zones)) {
      zonesMap.set(zoneName, { ...zoneDefinition });
    }
  }

  return {
    name: overrides.name || baseLayout.name,
    description: overrides.description || baseLayout.description,
    zones: Array.from(zonesMap.values()),
    gridTemplateAreas: overrides.gridTemplateAreas || baseLayout.gridTemplateAreas,
    gridTemplateColumns: overrides.gridTemplateColumns || baseLayout.gridTemplateColumns,
    gridTemplateRows: overrides.gridTemplateRows || baseLayout.gridTemplateRows,
    customStyles: overrides.customStyles || baseLayout.customStyles,
    source: baseLayout.source,
    priority: baseLayout.priority,
  };
}

/**
 * Deep clone a layout definition to avoid mutations
 *
 * @param layout - Layout to clone
 * @returns Cloned layout definition
 */
export function cloneLayout(layout: LayoutDefinition): LayoutDefinition {
  return {
    ...layout,
    zones: layout.zones.map(zone => ({ ...zone })),
  };
}

/**
 * Validate that a layout has all required zones for content
 *
 * @param layout - Layout to validate
 * @param requiredZones - Array of required zone names
 * @returns True if layout has all required zones
 */
export function hasRequiredZones(layout: LayoutDefinition, requiredZones: string[]): boolean {
  const layoutZoneNames = new Set(layout.zones.map(z => z.name));
  return requiredZones.every(required => layoutZoneNames.has(required));
}

/**
 * Get a list of zone names from a layout
 *
 * @param layout - Layout to get zone names from
 * @returns Array of zone names
 */
export function getZoneNames(layout: LayoutDefinition): string[] {
  return layout.zones.map(z => z.name);
}

/**
 * Find a zone by name in a layout
 *
 * @param layout - Layout to search in
 * @param zoneName - Name of the zone to find
 * @returns The zone if found, undefined otherwise
 */
export function findZone(layout: LayoutDefinition, zoneName: string): LayoutZone | undefined {
  return layout.zones.find(z => z.name === zoneName);
}

/**
 * Check if two layouts are compatible for merging
 * (no conflicting zone definitions with different properties)
 *
 * @param layout1 - First layout
 * @param layout2 - Second layout
 * @returns Object with compatibility status and conflicts if any
 */
export function checkLayoutCompatibility(
  layout1: LayoutDefinition,
  layout2: LayoutDefinition
): {
  compatible: boolean;
  conflicts: string[];
} {
  const conflicts: string[] = [];

  for (const zone1 of layout1.zones) {
    const zone2 = layout2.zones.find(z => z.name === zone1.name);
    if (zone2) {
      // Check if zones have conflicting grid areas
      if (zone1.gridArea && zone2.gridArea && zone1.gridArea !== zone2.gridArea) {
        conflicts.push(`Zone "${zone1.name}" has conflicting gridArea: "${zone1.gridArea}" vs "${zone2.gridArea}"`);
      }
    }
  }

  return {
    compatible: conflicts.length === 0,
    conflicts,
  };
}