import { createStyles } from 'antd-style';

export const useStyles = createStyles(() => {
  return {
    EditorContainer: {
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '.img-list-section': {
        background: 'rgba(0, 0, 0, 0.6)',
        width: '200px',
        height: '100%',
        boxSizing: 'border-box',
        padding: '20px 0',
      },
      '.main-content':{
        width: 'calc(100vw - 200px)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        '.img-preview-section':{
          background: 'rgba(0, 0, 0, 0.4)',
          width: '100%',
          height: 'calc(100vh - 100px)',
          overflow: 'hidden',
          boxSizing: 'border-box',
          padding: '20px',
        },
        '.operations-section':{
          background: 'rgba(0, 0, 0, 0.2)',
          width: '100%',
          height: '100px',
        },
      }
    },
    ImgListContainer:{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#eaeaea transparent',
      scrollbarGutter: 'stable',
      '.img-item':{
        cursor: 'pointer',
        margin: '10px 0',
        border: '2px solid transparent',
        transition: 'border-color 0.3s ease-in-out',
        '&:hover':{
          borderColor: '#007bff',
        },
        '&.active':{
          borderColor: '#007bff',
        },
        img:{
          display: 'block',
          width: '100px',
          height: '100px',
          objectFit: 'contain',
          background: '#000',
        }
      }
    },
    OperationsContainer:{
      userSelect: 'none',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '.operate-item':{
        cursor: 'pointer',
        fontSize: '24px',
        color: '#000',
        transition: 'color 0.3s ease-in-out',
        '&.active':{
          color: 'rgba(0, 123, 255, 1)',
        },
        '&.do-item':{
          transition: 'color 0.1s ease-in-out',
          '&:hover':{
            color: 'rgba(0, 123, 255, .2)',
          },
          '&:active':{
            color: 'rgba(0, 123, 255, 1)',
          },
          '&.disabled':{
            color: '#999',
            cursor: 'not-allowed',
          }
        }
      }
    },
    ImageEditorContainer:{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      '.image-information':{
        width: '100%',
        userSelect: 'none',
        position: 'absolute',
        bottom: '0',
        left: '0',
        color: '#fff',
        fontSize: '16px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        boxSizing: 'border-box',
        '.image-information-item':{
          marginBottom: '10px',
          '.reset-icon':{
            cursor: 'pointer',
            visibility: 'hidden',
          },
          '&:hover':{
            '.reset-icon':{
              visibility: 'visible',
            }
          }
        }
      },
      '.text-input':{
        position: 'fixed',
        left: '0px',
        top: '0px',
        minWidth: '10px',
        fontSize: '24px',
        color: '#f00',
        lineHeight: '1.2',
        outline: '2px dashed rgba(224,224,224,1)',
        boxSizing: 'border-box',
        background: 'transparent',
        resize: 'none',
        display: 'none',
      },
      '.btns':{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
      }
    },
    OperateSizeColorContainer:{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '.size':{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '.size-item':{
          cursor: 'pointer',
          borderRadius: '4px',
          // backgroundColor: '#eaeaea',
          width: '24px',
          height: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover':{
            backgroundColor: '#f4f4f4',
          },
          '&::after':{
            content: '""',
            display: 'block',
            borderRadius: '50%',
            backgroundColor: '#e9e9e9',
          },
          '&.small::after':{
            width: '8px',
            height: '8px',
          },
          '&.medium::after':{
            width: '12px',
            height: '12px',
          },
          '&.large::after':{
            width: '16px',
            height: '16px',
          },
          '&.active':{
            '&::after':{
              backgroundColor: '#76ff7f',
            }
          },
        }
      },
      '.color':{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '20px',
        '.color-item':{
          margin: '0 5px',
          cursor: 'pointer',
          borderRadius: '4px',
          width: '25px',
          height: '25px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover':{
            backgroundColor: '#f4f4f4',
          },
          '&::after':{
            content: '""',
            display: 'block',
            borderRadius: '2px',
            width: '18px',
            height: '18px',
          },
          '&.blue::after':{
            backgroundColor: '#007bff',
          },
          '&.green::after':{
            backgroundColor: '#28a745',
          },
          '&.yellow::after':{
            backgroundColor: '#ffc107',
          },
          '&.gray::after':{
            backgroundColor: '#6c757d',
          },
          '&.white::after':{
            backgroundColor: '#fff',
            border: '1px solid #bebebe',
          },
          '&.red::after':{
            backgroundColor: '#dc3545',
          },
          '&.active':{
            backgroundColor: '#cbcbcbff',
          }
        }
      },
    },
  };
});
