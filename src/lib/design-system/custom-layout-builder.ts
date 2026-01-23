import type { LayoutZone } from '../types/layout';
import { LayoutSource } from '../types/layout';
import type { CustomLayoutDefinition } from '../types/deck';

/**
 * CustomLayoutBuilder provides helper methods for defining custom layouts in decks
 *
 * This builder simplifies the creation of custom layouts by providing:
 * - Fluent API for layout definition
 * - Validation of zone configurations
 * - Helper methods for extending and composing layouts
 * - Automatic priority and source assignment
 */
export class CustomLayoutBuilder {
  private layout: CustomLayoutDefinition;

  constructor(name: string, description: string = '') {
    this.layout = {
      name,
      description,
      zones: [],
      source: LayoutSource.DECK,
      priority: 100,
    };
  }

  /**
   * Static factory method to create a new builder
   */
  static create(name: string, description?: string): CustomLayoutBuilder {
    return new CustomLayoutBuilder(name, description);
  }

  /**
   * Add a zone to the layout
   */
  addZone(name: string, gridArea?: string, description?: string): this {
    const zone: LayoutZone = { name };
    if (gridArea) zone.gridArea = gridArea;
    if (description) zone.description = description;

    // Check for duplicate zone names
    if (this.layout.zones.find(z => z.name === name)) {
      throw new Error(`Zone "${name}" already exists in layout "${this.layout.name}"`);
    }

    this.layout.zones.push(zone);
    return this;
  }

  /**
   * Add multiple zones at once
   */
  addZones(zones: LayoutZone[]): this {
    for (const zone of zones) {
      this.addZone(zone.name, zone.gridArea, zone.description);
    }
    return this;
  }

  /**
   * Set grid template areas
   */
  setGridTemplateAreas(areas: string): this {
    this.layout.gridTemplateAreas = areas;
    return this;
  }

  /**
   * Set grid template columns
   */
  setGridTemplateColumns(columns: string): this {
    this.layout.gridTemplateColumns = columns;
    return this;
  }

  /**
   * Set grid template rows
   */
  setGridTemplateRows(rows: string): this {
    this.layout.gridTemplateRows = rows;
    return this;
  }

  /**
   * Set custom CSS styles
   */
  setCustomStyles(styles: string): this {
    this.layout.customStyles = styles;
    return this;
  }

  /**
   * Set the priority for layout resolution
   */
  setPriority(priority: number): this {
    this.layout.priority = priority;
    return this;
  }

  /**
   * Extend from an existing layout
   */
  extends(layoutName: string): this {
    this.layout.extends = layoutName;
    return this;
  }

  /**
   * Compose from multiple layouts
   */
  composeFrom(layoutNames: string[]): this {
    if (layoutNames.length === 0) {
      throw new Error('composeFrom requires at least one layout name');
    }
    this.layout.composeFrom = layoutNames;
    return this;
  }

  /**
   * Mark as overriding a specific layout
   */
  overrides(layoutName: string): this {
    this.layout.overrides = layoutName;
    return this;
  }

  /**
   * Add additional zones when extending
   */
  addAdditionalZones(zones: LayoutZone[]): this {
    if (!this.layout.additionalZones) {
      this.layout.additionalZones = [];
    }
    this.layout.additionalZones.push(...zones);
    return this;
  }

  /**
   * Remove zones when extending
   */
  removeZones(zoneNames: string[]): this {
    if (!this.layout.removeZones) {
      this.layout.removeZones = [];
    }
    this.layout.removeZones.push(...zoneNames);
    return this;
  }

  /**
   * Modify zones when extending
   */
  modifyZone(zoneName: string, modifications: Partial<LayoutZone>): this {
    if (!this.layout.modifyZones) {
      this.layout.modifyZones = {};
    }
    this.layout.modifyZones[zoneName] = modifications;
    return this;
  }

  /**
   * Validate the layout configuration
   */
  validate(): string[] {
    const errors: string[] = [];

    // Check required fields
    if (!this.layout.name) {
      errors.push('Layout name is required');
    }

    // Check zones configuration
    if (!this.layout.extends && !this.layout.composeFrom) {
      // For non-extended/composed layouts, zones are required
      if (this.layout.zones.length === 0) {
        errors.push('Layout must have at least one zone (unless extending or composing)');
      }

      // Check for grid configuration
      if (this.layout.zones.length > 0 && !this.layout.gridTemplateAreas && !this.layout.customStyles) {
        errors.push('Layout should define gridTemplateAreas or customStyles for zone positioning');
      }
    }

    // Check for conflicting configurations
    if (this.layout.extends && this.layout.composeFrom) {
      errors.push('Layout cannot both extend and compose from other layouts');
    }

    // Validate zone names are unique
    const zoneNames = new Set<string>();
    for (const zone of this.layout.zones) {
      if (zoneNames.has(zone.name)) {
        errors.push(`Duplicate zone name: "${zone.name}"`);
      }
      zoneNames.add(zone.name);
    }

    // Validate additional zones if present
    if (this.layout.additionalZones) {
      const additionalNames = new Set<string>();
      for (const zone of this.layout.additionalZones) {
        if (additionalNames.has(zone.name)) {
          errors.push(`Duplicate additional zone name: "${zone.name}"`);
        }
        additionalNames.add(zone.name);

        if (zoneNames.has(zone.name)) {
          errors.push(`Additional zone "${zone.name}" conflicts with existing zone`);
        }
      }
    }

    // Validate removeZones doesn't conflict with additionalZones
    if (this.layout.removeZones && this.layout.additionalZones) {
      for (const removeName of this.layout.removeZones) {
        if (this.layout.additionalZones.find(z => z.name === removeName)) {
          errors.push(`Cannot both remove and add zone: "${removeName}"`);
        }
      }
    }

    return errors;
  }

  /**
   * Build the custom layout definition
   */
  build(): CustomLayoutDefinition {
    const errors = this.validate();
    if (errors.length > 0) {
      throw new Error(`Layout validation failed:\n${errors.join('\n')}`);
    }

    // Return a copy to prevent further modifications
    return { ...this.layout, zones: [...this.layout.zones] };
  }

  /**
   * Create a simple custom layout (convenience method)
   */
  static simple(
    name: string,
    description: string,
    zones: LayoutZone[],
    gridTemplateAreas: string
  ): CustomLayoutDefinition {
    return new CustomLayoutBuilder(name, description)
      .addZones(zones)
      .setGridTemplateAreas(gridTemplateAreas)
      .build();
  }

  /**
   * Create an extended layout (convenience method)
   */
  static extend(
    name: string,
    baseLayout: string,
    options?: {
      description?: string;
      additionalZones?: LayoutZone[];
      removeZones?: string[];
      modifyZones?: { [zoneName: string]: Partial<LayoutZone> };
    }
  ): CustomLayoutDefinition {
    const builder = new CustomLayoutBuilder(name, options?.description || `Extended from ${baseLayout}`)
      .extends(baseLayout);

    if (options?.additionalZones) {
      builder.addAdditionalZones(options.additionalZones);
    }

    if (options?.removeZones) {
      builder.removeZones(options.removeZones);
    }

    if (options?.modifyZones) {
      for (const [zoneName, modifications] of Object.entries(options.modifyZones)) {
        builder.modifyZone(zoneName, modifications);
      }
    }

    return builder.build();
  }

  /**
   * Create a composed layout (convenience method)
   */
  static compose(
    name: string,
    description: string,
    fromLayouts: string[],
    options?: {
      additionalZones?: LayoutZone[];
      removeZones?: string[];
      gridTemplateAreas?: string;
    }
  ): CustomLayoutDefinition {
    const builder = new CustomLayoutBuilder(name, description)
      .composeFrom(fromLayouts);

    if (options?.additionalZones) {
      builder.addAdditionalZones(options.additionalZones);
    }

    if (options?.removeZones) {
      builder.removeZones(options.removeZones);
    }

    if (options?.gridTemplateAreas) {
      builder.setGridTemplateAreas(options.gridTemplateAreas);
    }

    return builder.build();
  }
}