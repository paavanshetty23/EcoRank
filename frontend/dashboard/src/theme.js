export const theme = {
  colorScheme: 'light',
  
  primaryColor: 'blue',
  primaryShade: 6,
  
  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace: '"Consolas", "Monaco", "Courier New", monospace',
  
  headings: {
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 700,
    sizes: {
      h1: { fontSize: '36px', lineHeight: '1.2', fontWeight: 700 },
      h2: { fontSize: '28px', lineHeight: '1.3', fontWeight: 600 },
      h3: { fontSize: '22px', lineHeight: '1.4', fontWeight: 600 },
      h4: { fontSize: '18px', lineHeight: '1.5', fontWeight: 500 },
    },
  },
  
  defaultRadius: 6,
  
  colors: {
    blue: [
      '#e3f2ff',
      '#c5e4ff',
      '#8cc9ff',
      '#52aeff',
      '#2b94ff',
      '#0f62fe',
      '#0056e0',
      '#004bbb',
      '#003d96',
      '#002f72',
    ],
  },
  
  components: {
    Table: {
      defaultProps: {
        striped: false,
        highlightOnHover: true,
        withTableBorder: false,
        withColumnBorders: false,
      },
    },
    
    Badge: {
      defaultProps: {
        radius: 'sm',
      },
    },
    
    Paper: {
      defaultProps: {
        shadow: 'xs',
        radius: 'md',
      },
    },
    
    Button: {
      defaultProps: {
        radius: 'sm',
      },
    },
  },
  
  globalStyles: (theme) => ({
    body: {
      backgroundColor: '#ffffff',
      color: '#111827',
    },
  }),
}
