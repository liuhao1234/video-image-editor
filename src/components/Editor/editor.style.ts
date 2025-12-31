import { createStyles } from 'antd-style';

export const useEditorStyles = createStyles(({token}) => {
  return {
    'toolSection':{
      width: '100%',
      height: '100%',
      userSelect: 'none',
    },
    'videoSection': {
      position: 'relative',
      zIndex: 10000,
      '.video-list': {
        marginTop: '10px',
        '.video-item': {
          cursor: 'pointer',
          position: 'relative',
          boxSizing: 'border-box',
          border: `2px solid ${token.colorPrimary}`,
          width: '160px',
          height: '90px',
          img:{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          },
          '.process':{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '16px',
          }
        }
      }
    },
    'imageSection':{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      '.image-item':{
        position: 'relative',
        boxSizing: 'border-box',
        borderRadius: '8px',
        overflow: 'hidden',
        width: '100px',
        height: '100px',
        img:{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
        '.add-btn':{
          position: 'absolute',
          bottom: 5,
          right: 5,
          fontSize: '20px',
          zIndex: 1,
          color: token.colorPrimary,
          cursor: 'pointer',
        }
      }
    },
    'previewSection':{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      video:{
        position: 'absolute',
        top: 0,
        left: 0,
        visibility: 'hidden',
        width: '100px',
      },
      '.preview-container':{
        boxSizing: 'border-box',
        padding: '10px',
        position: 'relative',
        width: '100%',
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '.preview-inner':{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1000,
          '.video-canvas':{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            background: '#000',
            transition: 'all 0.3s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '.video-player':{
              canvas:{
                display: 'block',
              }
            }
          }
        }
      },
      '.preview-controls':{
        boxSizing: 'border-box',
        padding: '0 20px',
        width: '100%',
        height: '50px',
        position: 'relative',
        '.left':{
          position: 'absolute',
          top: 0,
          left: '10px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          '.time':{
            color: token.textColor,
            fontSize: '14px',
          }
        },
        '.middle':{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          
          '.play-pause':{
            fontSize: '26px',
            cursor: 'pointer',
          }
        },
        '.right':{
          position: 'absolute',
          top: 0,
          right: '10px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          '.video-ratio':{
            span:{
              boxSizing: 'border-box',
              width: '40px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              border: `1px solid ${token.textColor}`,
              cursor: 'pointer',
            }
          }
        }
      },
    },
    'ratioList':{
      display: 'flex',
      flexDirection: 'column',
      '.ratio-item':{
        cursor: 'pointer',
        height: '30px',
        width: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    },
    'propsSection':{
      width: '100%',
      height: '100%',
    },
    'trackSection':{
      width: '100%',
      height: '100%',
      userSelect: 'none',
    },
    'timeline':{
      width: '100%',
      height: '20px',
    },
    'trackListContainer':{
      boxSizing: 'border-box',
      width: '100%',
      height: 'calc(100% - 20px)',
      position: 'relative',
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      '.track-list':{
        minWidth: '100%',
        '.track-line':{
          backgroundColor: '#303030',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          '.track-item':{
            position:'relative',
            cursor: 'pointer',
            '&.video':{
              borderRadius: '4px',
              backgroundColor: '#3d3d3d',
              overflow: 'hidden',
              boxSizing: 'border-box',
              border: `1px solid #393939`,
              '.title':{
                boxSizing: 'border-box',
                padding: '0 10px',
                color: '#fff',
                fontSize: '12px',
                width: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                background: '#3d3d3d',
                height: '20px',
                lineHeight: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'nowrap',
                span:{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '&:first-child':{
                    width: '60%'
                  },
                  '&:last-child':{
                    width: '40%',
                    textAlign: 'right',
                  }
                }
              },
              '.frame-images':{
                width: '100%',
                height: '40px',
                background: '#424242',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                span:{
                  color: '#fff',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }
              }
            },
            '.handler':{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              borderRadius: '4px',
              borderTop: `2px solid ${token.textColor}`,
              borderBottom: `2px solid ${token.textColor}`,
              zIndex: 2000,
              '.handler-icon':{
                position: 'absolute',
                top: 0,
                width: '6px',
                height: '100%',
                background: token.textColor,
                cursor: 'ew-resize',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&.handler-left':{
                  left: 0,
                },
                '&.handler-right':{
                  right: 0,
                }
              }
            }
          }
        }
        
      }
    },
    'sectionHeader':{
      boxSizing: 'border-box',
      height: '50px',
      background: '#303030',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: '20px',
      padding: '0 20px',
      borderBottom: '1px solid #000',
      '&.bg-none':{
        background: 'none',
      }
    },
    'trackSectionHeader':{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '.left-section':{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '20px',
      },
      '.right-section':{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '20px',
        '.btn-center':{
          cursor: 'pointer',
          '&:active':{
            color: '#00c1cd',
          }
        },
        '.scale':{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          span: {
            cursor: 'pointer',
            '&:active':{
              color: '#00c1cd',
            }
          },
          '.slider-item':{
            width: '150px',
          }
        }
      },
    },
    'headerItem':{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      cursor: 'pointer',
      color: token.textColor,
      '&.active':{
        color: '#00c1cd',
        'span.text':{
          color: '#00c1cd',
        }
      },
      '&:active':{
        color: '#00c1cd',
        'span.text':{
          color: '#00c1cd',
        }
      },
      '&.disabled':{
        cursor: 'not-allowed',
        opacity: 0.5,
      },
      i:{},
      'span.text':{
        fontSize: '12px',
        userSelect: 'none',
      }
    },
    'sectionContent':{
      height: 'calc(100% - 50px)',
      boxSizing: 'border-box',
      padding: '10px',
      '&.padding-none':{
        padding: 0,
      },
    },
    'trackSectionContent':{
      display: 'flex',
      '.left-content':{
        width: '50px',
        height: '100%',
        boxSizing: 'border-box',
        paddingTop: '20px',
        borderRight: '1px solid #000',
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      },
      '.right-content':{
        width: 'calc(100% - 60px)',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      },
    },
    'exportModal':{
      h2:{
        margin: 0,
        color: token.textColor,
        fontSize: '14px',
      },
      button:{
        fontSize: '12px',
      },
      '.export-form':{
        minHeight: '200px',
      },
      '.detail':{
        color: token.textColor,
        fontSize: '12px',
      },
      '.ant-modal-content':{
        color: token.textColor,
        background: '#303030',
        padding: '10px 12px',
      },
      '.ant-modal-title':{
        color: token.textColor,
        background: 'none',
      },
    },
    'adjustSection':{
      
    },
    'adjustSliderItem':{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      fontSize: '12px',
      '.text':{
        color: token.textColor,
        width: '50px'
      },
      '.slider-group':{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        '.slider-item':{
          flex: 1,
        },
        '.number-input':{
          width: '60px',
        }
      }
    },
    'btnNormal':{
      fontSize: '12px',
    },
    'trackPlayPoint':{
      opacity: 0.8,
      width: '10px',
      height: '100%',
      position: 'absolute',
      top: '0',
      left: '-5px',
      transform: 'translateX(0px)',
      zIndex: 1000,
      '.handler':{
        width: '10px',
        height: '13px',
        background: '#fff',
        position: 'relative',
        "&::after":{
          content: '""',
          width: '0',
          height: '0',
          border: '5px solid',
          position: 'absolute',
          top: '100%',
          borderTopColor: '#fff',
          borderRightColor: 'transparent',
          borderLeftColor: 'transparent',
          borderBottomColor: 'transparent',
        }
      },
      '&::after':{
        content: '""',
        width: '1px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#fff',
      }
    },
    'customScroll':{
      /* --- Firefox 自定义 --- */
      scrollbarWidth: 'thin', /* auto, thin, none (隐藏) */
      scrollbarColor: '#818181 #434343', /* <thumb-color> <track-color> */
      '&::-webkit-scrollbar': {
        width: '8px', /* 垂直滚动条的宽度 */
        height: '8px', /* 水平滚动条的高度 */
      },
      /* 2. 滚动条轨道 */
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1', /* 轨道背景色 */
        borderRadius: '10px', /* 轨道圆角 */
      },
      /* 3. 滚动条滑块 */
      '&::-webkit-scrollbar-thumb': {
        background: '#c5c5c5', /* 滑块背景色 */
        borderRadius: '10px', /* 滑块圆角 */
      },
      /* 4. 鼠标悬停在滑块上 */
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#a8a8a8', /* 悬停时滑块背景色 */
      },
      /* 5. 鼠标按住滑块并拖动时 */
      '&::-webkit-scrollbar-thumb:active': {
        background: '#7f7f7f', /* 拖动时滑块背景色 */
      }
    }
  }
});
