import React, { useState } from 'react'
import styles from './showcase.module.scss'

const Showcase: React.FC = () => {
  const previewUrl = 'https://dominium.com.ua'
  const fallbackImage = '/web-dev-showcase.png'
  const [showLivePreview, setShowLivePreview] = useState(false)

  return (
    <section className={styles.showcase}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Ми створюємо сайти, боти та автоматизацію для вашого бізнесу.
          <br />
          Кожен проєкт — це чистий код, структуровані процеси
          <br />
          та результат, який працює на ваші цілі.
        </h2>

        <div className={styles.mockups}>
          <div className={styles.desktop}>
            <div className={styles.desktop__header}>
              <div className={styles.desktop__controls}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.desktop__address}>https://mimo.org/lesson/124ty</div>
              <div className={styles.desktop__avatar} />
            </div>

            <div className={styles.desktop__body}>
              <div className={styles.desktop__sidebar}>
                <div className={styles.desktop__sidebar_head}>
                  <div className={styles.desktop__app}>Pixel Paws</div>
                  <div className={styles.desktop__tabs}>
                    <span className={styles.desktop__tab_active}>Instructions</span>
                    <span>AI Chat</span>
                    <span>MIMO</span>
                  </div>
                </div>
                <div className={styles.desktop__card}>
                  <p className={styles.desktop__card_title}>Tasks:</p>
                  <p className={styles.desktop__card_text}>
                    Inside the setInterval function, also call
                    <br />
                    <code>pet2.decreaseFeedLevel();</code>
                  </p>
                </div>
                <div className={styles.desktop__assistant}>
                  <div className={styles.desktop__assistant_avatar} />
                  <div>
                    <p className={styles.desktop__assistant_title}>
                      I’m MIMO and I’m here to help you with this project.
                    </p>
                    <button className={styles.desktop__assistant_btn}>I need help</button>
                  </div>
                </div>
                <div className={styles.desktop__input}>Type your question</div>
              </div>

              <div className={styles.desktop__editor}>
                <div className={styles.desktop__editor_tabs}>
                  <span className={styles.desktop__editor_tab_active}>index.html</span>
                  <span>style.css</span>
                  <span>script.js</span>
                </div>
                <div className={styles.desktop__code}>
                  <div className={styles.desktop__line} />
                  <div className={styles.desktop__line} />
                  <div className={styles.desktop__line} />
                  <div className={`${styles.desktop__line} ${styles.desktop__line_highlight}`} />
                  <div className={styles.desktop__line} />
                  <div className={styles.desktop__line} />
                  <div className={`${styles.desktop__line} ${styles.desktop__line_highlight}`} />
                  <div className={styles.desktop__line} />
                  <div className={styles.desktop__line} />
                  <div className={styles.desktop__line} />
                </div>
                <div className={styles.desktop__footer}>
                  <div className={styles.desktop__footer_left}>
                    <span />
                    <span />
                    <span />
                  </div>
                  <button className={styles.desktop__submit}>Submit</button>
                </div>
              </div>

              <div className={styles.desktop__preview}>
                <div className={styles.desktop__preview_url}>{previewUrl}</div>
                <div className={styles.desktop__preview_live}>
                  <div className={styles.desktop__preview_label}>Live preview</div>
                  {!showLivePreview ? (
                    <div className={styles.desktop__preview_fallback}>
                      <img
                        src={fallbackImage}
                        alt="Web development preview"
                        className={styles.desktop__preview_image}
                        loading="lazy"
                      />
                      <div className={styles.desktop__preview_actions}>
                        <button
                          type="button"
                          className={styles.desktop__preview_button}
                          onClick={() => setShowLivePreview(true)}
                        >
                          Показати live
                        </button>
                        <a
                          className={styles.desktop__preview_link}
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Відкрити у вкладці
                        </a>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      src={previewUrl}
                      title="Live desktop preview"
                      loading="lazy"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* <div className={styles.mobile}>
            <div className={styles.mobile__notch} />
            <div className={styles.mobile__header}>
              <div className={styles.mobile__time}>9:41</div>
              <div className={styles.mobile__status}>
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className={styles.mobile__body}>
            <div className={styles.mobile__chips}>
              <span className={styles.mobile__chip_active}>❤️❤️❤️❤️</span>
            </div>
            <p className={styles.mobile__task}>Add the closing tags in the correct positions.</p>
            <div className={styles.mobile__live}>
              <div className={styles.mobile__live_label}>Live preview</div>
              <iframe
                src="https://dominium.com.ua"
                title="Live mobile preview"
                loading="lazy"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
            <div className={styles.mobile__tags}>
              <span>Reload</span>
              <span>Share</span>
              <span>Copy link</span>
            </div>
          </div>

            <div className={styles.mobile__footer}>
              <div className={styles.mobile__controls}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.mobile__run} />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}

export default Showcase
