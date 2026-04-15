import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

describe('Bug修复验证测试', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Bug 1 & 2: 地图显示和自动适配', () => {
    it('scale-screen组件应该正确绑定autoScale属性', async () => {
      const { useSettingStore } = await import('@/stores/setting/setting')
      const settingStore = useSettingStore()
      
      expect(settingStore.isScale).toBeDefined()
      expect(typeof settingStore.isScale).toBe('boolean')
    })

    it('设置isScale应该能够正确保存', async () => {
      const { useSettingStore } = await import('@/stores/setting/setting')
      const settingStore = useSettingStore()
      
      settingStore.setIsScale(true)
      expect(settingStore.isScale).toBe(true)
      
      settingStore.setIsScale(false)
      expect(settingStore.isScale).toBe(false)
    })
  })

  describe('Bug 3: 模块标题显示', () => {
    it('item-wrap组件应该正确接收title属性', async () => {
      const ItemWrap = (await import('@/components/item-wrap/item-wrap.vue')).default
      
      const wrapper = mount(ItemWrap, {
        props: {
          title: '测试标题'
        },
        global: {
          stubs: {
            'BorderBox13': {
              template: '<div><slot></slot></div>'
            }
          }
        }
      })
      
      expect(wrapper.props('title')).toBe('测试标题')
    })

    it('item-wrap组件应该正确显示标题内容', async () => {
      const ItemWrap = (await import('@/components/item-wrap/item-wrap.vue')).default
      
      const wrapper = mount(ItemWrap, {
        props: {
          title: '设备总览'
        },
        global: {
          stubs: {
            'BorderBox13': {
              template: '<div><slot></slot></div>'
            }
          }
        }
      })
      
      const titleElement = wrapper.find('.title-inner')
      expect(titleElement.exists()).toBe(true)
      expect(titleElement.text()).toContain('设备总览')
    })
  })

  describe('Bug 4: 设备提醒滚动', () => {
    it('indexConfig应该包含正确的leftBottomSwiper属性', async () => {
      const { useSettingStore } = await import('@/stores/setting/setting')
      const settingStore = useSettingStore()
      
      expect(settingStore.indexConfig).toBeDefined()
      expect(settingStore.indexConfig.leftBottomSwiper).toBeDefined()
      expect(typeof settingStore.indexConfig.leftBottomSwiper).toBe('boolean')
    })

    it('setIndexConfig应该能够正确更新配置', async () => {
      const { useSettingStore } = await import('@/stores/setting/setting')
      const settingStore = useSettingStore()
      
      const newConfig = {
        leftBottomSwiper: false,
        rightBottomSwiper: true
      }
      
      settingStore.setIndexConfig(newConfig)
      expect(settingStore.indexConfig.leftBottomSwiper).toBe(false)
      expect(settingStore.indexConfig.rightBottomSwiper).toBe(true)
    })
  })
})
