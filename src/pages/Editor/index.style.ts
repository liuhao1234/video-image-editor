import { createStyles } from 'antd-style';

export const useStyles = createStyles(() => {
  return {
    VideoEditorContainer: {
      width: '100vw',
      height: '100vh',
      minWidth: '1200px',
      minHeight: '800px',
      backgroundColor: '#141414',
      color: '#fff',
      overflow: 'hidden',
      '.header': {
        height: '40px',
      },
      '.content': {
        boxSizing: 'border-box',
        padding: '10px',
        height: 'calc(100vh - 40px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '.content-top': {
          width: '100%',
          flex: '1',
          display: 'flex',
        },
        '.section': {
          backgroundColor: '#262626',
          borderRadius: '10px',
          overflow: 'hidden',
        },
        '.section-tool': {
          width: '25%',
          minWidth: '200px',
          height: '100%',
        },
        '.section-preview': {
          flex: '1',
          height: '100%',
        },
        '.section-properties': {
          width: '25%',
          minWidth: '200px',
          height: '100%',
        },
        '.section-track': {
          width: '100%',
          height: '45%',
        },
        '.resizer': {
          '&.resizer-vertical': {
            width: '10px',
            height: '100%',
            cursor: 'col-resize',
          },
          '&.resizer-horizontal': {
            width: '100%',
            height: '10px',
            cursor: 'row-resize',
          },
        },
      },
    },
  };
});
