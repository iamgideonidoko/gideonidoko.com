/* eslint-disable @next/next/no-img-element */
import { Fragment } from 'react';
import styles from '../styles/Uses.module.css';
import { NextSeo } from 'next-seo';

const Stats = () => {
  return (
    <Fragment>
      <NextSeo
        title="Uses - Gideon Idoko"
        description="Here are some of the stuff I use in my day-to-day workflow."
        canonical="https://gideonidoko.com/uses"
        openGraph={{
          url: 'https://gideonidoko.com/uses',
          title: 'Uses - Gideon Idoko',
          description: 'Here are some of the stuff I use in my day-to-day workflow.',
          images: [
            {
              url: 'https://gideonidoko.com/assets/img/GideonIdokoCardImage.png',
              width: 1500,
              height: 500,
              alt: "Gideon Idoko's card image",
            },
          ],
          site_name: 'Gideon Idoko',
        }}
        twitter={{
          handle: '@IamGideonIdoko',
          site: '@IamGideonIdoko',
          cardType: 'summary_large_image',
        }}
      />
      <main className={`padding-top-10rem ${styles.main}`}>
        <div className="container-full">
          <div className={styles.intro}>
            <h1 className={styles.introText}>
              <span>U</span>
              <span>S</span>
              <span>E</span>
              <span>S</span>
            </h1>
            <div className={styles.workspace}>
              <div className="gooey__image">
                <img
                  src="/assets/img/workspace.jpeg"
                  data-hover="/assets/img/workspace-hover.jpeg"
                  alt="Workspace"
                  style={{ maxWidth: '100%' }}
                  width={330}
                />
              </div>
            </div>
          </div>
          <div className={styles.lists}>
            <div>
              <h2>Hardware</h2>
              <ul>
                <li>Mi Curved Gaming Monitor 34&quot;</li>
                <li>16&quot; MBP</li>
                <li>Logitech MX Master 3s</li>
                <li>Logitech Mx Keys</li>
                <li>Sit-stand Desk SSDE-06</li>
                <li>Desk Clock/Lamp</li>
              </ul>
            </div>
            <div>
              <h2>Terminal Sh*t</h2>
              <ul>
                <li>iTerm2 (Terminal)</li>
                <li>Neovim (Editor)</li>
                <li>Tokyo Night (Theme)</li>
                <li>Comic Code (Font)</li>
                <li>tmux (Terminal Multiplexer)</li>
                <li>zsh (Unix Shell)</li>
              </ul>
            </div>
            <div>
              <h2>Utility Software</h2>
              <ul>
                <li>Vimium (Browser Vim Control)</li>
                <li>SketchyVim (Vim-like Text Inputs)</li>
                <li>Scoot (Cursor Actuator)</li>
                <li>Rectangle (Window Resizer)</li>
                <li>Lulu (Firewall)</li>
                <li>TunnelBear (VPN)</li>
              </ul>
            </div>
            <div>
              <h2>Other Software</h2>
              <ul>
                <li>Chrome</li>
                <li>OrbStack</li>
                <li>Spotify</li>
                <li>DBeaver</li>
                <li>Figma</li>
                <li>Blender</li>
                <li>Android Studio</li>
                <li>Xcode</li>
                <li>Expo Orbit</li>
                <li>MAMP</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default Stats;
