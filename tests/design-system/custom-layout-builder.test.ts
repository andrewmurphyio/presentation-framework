import { describe, it, expect } from 'vitest';
import { CustomLayoutBuilder } from '../../src/lib/design-system/custom-layout-builder';
import { LayoutSource } from '../../src/lib/types/layout';

describe('CustomLayoutBuilder', () => {
  describe('basic layout building', () => {
    it('should create a simple layout with zones', () => {
      const layout = CustomLayoutBuilder.create('test-layout', 'Test layout description')
        .addZone('header', 'header-area', 'Header zone')
        .addZone('content', 'content-area', 'Main content')
        .setGridTemplateAreas('"header" "content"')
        .setGridTemplateColumns('1fr')
        .setGridTemplateRows('auto 1fr')
        .build();

      expect(layout.name).toBe('test-layout');
      expect(layout.description).toBe('Test layout description');
      expect(layout.zones).toHaveLength(2);
      expect(layout.zones[0].name).toBe('header');
      expect(layout.zones[0].gridArea).toBe('header-area');
      expect(layout.zones[1].name).toBe('content');
      expect(layout.source).toBe(LayoutSource.DECK);
      expect(layout.priority).toBe(100);
    });

    it('should add multiple zones at once', () => {
      const zones = [
        { name: 'zone1', gridArea: 'z1' },
        { name: 'zone2', gridArea: 'z2' },
        { name: 'zone3', gridArea: 'z3' },
      ];

      const layout = CustomLayoutBuilder.create('multi-zone')
        .addZones(zones)
        .setGridTemplateAreas('"z1" "z2" "z3"')
        .build();

      expect(layout.zones).toHaveLength(3);
      expect(layout.zones.map(z => z.name)).toEqual(['zone1', 'zone2', 'zone3']);
    });

    it('should set custom styles', () => {
      const customStyles = `
        .slide {
          background: linear-gradient(to bottom, #000, #333);
        }
      `;

      const layout = CustomLayoutBuilder.create('styled')
        .addZone('main')
        .setCustomStyles(customStyles)
        .build();

      expect(layout.customStyles).toBe(customStyles);
    });

    it('should set custom priority', () => {
      const layout = CustomLayoutBuilder.create('priority-test')
        .addZone('test')
        .setGridTemplateAreas('"test"')
        .setPriority(150)
        .build();

      expect(layout.priority).toBe(150);
    });

    it('should use fluent API', () => {
      const layout = CustomLayoutBuilder
        .create('fluent')
        .addZone('a')
        .addZone('b')
        .addZone('c')
        .setGridTemplateAreas('"a b" "c c"')
        .setGridTemplateColumns('1fr 1fr')
        .setGridTemplateRows('1fr 1fr')
        .build();

      expect(layout.zones).toHaveLength(3);
      expect(layout.gridTemplateAreas).toBe('"a b" "c c"');
    });
  });

  describe('extending layouts', () => {
    it('should extend from another layout', () => {
      const layout = CustomLayoutBuilder.create('extended')
        .extends('base-layout')
        .build();

      expect(layout.extends).toBe('base-layout');
    });

    it('should add additional zones when extending', () => {
      const layout = CustomLayoutBuilder.create('extended')
        .extends('base')
        .addAdditionalZones([
          { name: 'footer', gridArea: 'footer' },
          { name: 'sidebar', gridArea: 'sidebar' },
        ])
        .build();

      expect(layout.extends).toBe('base');
      expect(layout.additionalZones).toHaveLength(2);
      expect(layout.additionalZones![0].name).toBe('footer');
      expect(layout.additionalZones![1].name).toBe('sidebar');
    });

    it('should remove zones when extending', () => {
      const layout = CustomLayoutBuilder.create('extended')
        .extends('base')
        .removeZones(['unwanted1', 'unwanted2'])
        .build();

      expect(layout.removeZones).toEqual(['unwanted1', 'unwanted2']);
    });

    it('should modify zones when extending', () => {
      const layout = CustomLayoutBuilder.create('extended')
        .extends('base')
        .modifyZone('header', { gridArea: 'new-header', description: 'Modified' })
        .modifyZone('content', { gridArea: 'new-content' })
        .build();

      expect(layout.modifyZones).toBeDefined();
      expect(layout.modifyZones!['header']).toEqual({
        gridArea: 'new-header',
        description: 'Modified',
      });
      expect(layout.modifyZones!['content']).toEqual({
        gridArea: 'new-content',
      });
    });

    it('should use extend convenience method', () => {
      const layout = CustomLayoutBuilder.extend('my-extended', 'base-layout', {
        description: 'Extended layout',
        additionalZones: [{ name: 'extra', gridArea: 'extra' }],
        removeZones: ['old'],
        modifyZones: {
          main: { gridArea: 'new-main' },
        },
      });

      expect(layout.extends).toBe('base-layout');
      expect(layout.description).toBe('Extended layout');
      expect(layout.additionalZones).toHaveLength(1);
      expect(layout.removeZones).toContain('old');
      expect(layout.modifyZones!['main'].gridArea).toBe('new-main');
    });
  });

  describe('composing layouts', () => {
    it('should compose from multiple layouts', () => {
      const layout = CustomLayoutBuilder.create('composed')
        .composeFrom(['layout1', 'layout2', 'layout3'])
        .build();

      expect(layout.composeFrom).toEqual(['layout1', 'layout2', 'layout3']);
    });

    it('should compose with additional zones', () => {
      const layout = CustomLayoutBuilder.create('composed')
        .composeFrom(['base1', 'base2'])
        .addAdditionalZones([{ name: 'custom', gridArea: 'custom' }])
        .setGridTemplateAreas('"custom"')
        .build();

      expect(layout.composeFrom).toEqual(['base1', 'base2']);
      expect(layout.additionalZones).toHaveLength(1);
      expect(layout.gridTemplateAreas).toBe('"custom"');
    });

    it('should use compose convenience method', () => {
      const layout = CustomLayoutBuilder.compose(
        'my-composed',
        'Composed layout',
        ['layout1', 'layout2'],
        {
          additionalZones: [{ name: 'extra', gridArea: 'extra' }],
          removeZones: ['unwanted'],
          gridTemplateAreas: '"extra"',
        }
      );

      expect(layout.name).toBe('my-composed');
      expect(layout.description).toBe('Composed layout');
      expect(layout.composeFrom).toEqual(['layout1', 'layout2']);
      expect(layout.additionalZones).toHaveLength(1);
      expect(layout.removeZones).toContain('unwanted');
      expect(layout.gridTemplateAreas).toBe('"extra"');
    });
  });

  describe('overriding layouts', () => {
    it('should mark layout as override', () => {
      const layout = CustomLayoutBuilder.create('custom-title')
        .overrides('title')
        .addZone('title')
        .addZone('subtitle')
        .addZone('logo')
        .setGridTemplateAreas('"title" "subtitle" "logo"')
        .build();

      expect(layout.overrides).toBe('title');
    });
  });

  describe('validation', () => {
    it('should validate required name', () => {
      const builder = new CustomLayoutBuilder('', 'description');
      builder.addZone('test');

      const errors = builder.validate();
      expect(errors).toContain('Layout name is required');
    });

    it('should require zones for non-extended layouts', () => {
      const builder = CustomLayoutBuilder.create('empty');

      const errors = builder.validate();
      expect(errors).toContain('Layout must have at least one zone (unless extending or composing)');
    });

    it('should suggest grid configuration', () => {
      const builder = CustomLayoutBuilder.create('no-grid')
        .addZone('test');

      const errors = builder.validate();
      expect(errors).toContain('Layout should define gridTemplateAreas or customStyles for zone positioning');
    });

    it('should detect duplicate zone names', () => {
      const builder = CustomLayoutBuilder.create('duplicates')
        .addZone('zone1')
        .addZone('zone2');

      // Try to add duplicate
      expect(() => builder.addZone('zone1')).toThrow('Zone "zone1" already exists');
    });

    it('should detect conflicts between extend and compose', () => {
      const builder = CustomLayoutBuilder.create('conflict')
        .extends('base')
        .composeFrom(['layout1']); // This creates a conflict

      const errors = builder.validate();
      expect(errors).toContain('Layout cannot both extend and compose from other layouts');
    });

    it('should detect conflicts between remove and add zones', () => {
      const builder = CustomLayoutBuilder.create('conflict')
        .extends('base')
        .addAdditionalZones([{ name: 'footer', gridArea: 'footer' }])
        .removeZones(['footer']); // Conflict: both adding and removing 'footer'

      const errors = builder.validate();
      expect(errors).toContain('Cannot both remove and add zone: "footer"');
    });

    it('should throw on build if validation fails', () => {
      const builder = CustomLayoutBuilder.create('invalid')
        .extends('base')
        .composeFrom(['other']); // Conflict

      expect(() => builder.build()).toThrow('Layout validation failed');
    });

    it('should require at least one layout name for composeFrom', () => {
      const builder = CustomLayoutBuilder.create('empty-compose');

      expect(() => builder.composeFrom([])).toThrow('composeFrom requires at least one layout name');
    });
  });

  describe('simple convenience method', () => {
    it('should create a simple layout quickly', () => {
      const layout = CustomLayoutBuilder.simple(
        'quick',
        'Quick layout',
        [
          { name: 'header', gridArea: 'header' },
          { name: 'main', gridArea: 'main' },
        ],
        '"header" "main"'
      );

      expect(layout.name).toBe('quick');
      expect(layout.description).toBe('Quick layout');
      expect(layout.zones).toHaveLength(2);
      expect(layout.gridTemplateAreas).toBe('"header" "main"');
    });
  });

  describe('immutability', () => {
    it('should return a copy from build to prevent modifications', () => {
      const builder = CustomLayoutBuilder.create('test')
        .addZone('zone1')
        .setGridTemplateAreas('"zone1"');

      const layout1 = builder.build();
      const layout2 = builder.build();

      expect(layout1).not.toBe(layout2); // Different object references
      expect(layout1).toEqual(layout2); // But same content

      // Modifying one shouldn't affect the other
      layout1.zones.push({ name: 'extra' });
      expect(layout2.zones).toHaveLength(1); // Should still be 1
    });
  });
});