import type { Metadata } from 'next';
import Image from 'next/image';
import { createPageMetadata } from '../../lib/site';
import styles from '../../styles/Uses.module.css';

export const metadata: Metadata = createPageMetadata({
  title: 'Uses - Gideon Idoko',
  description: 'Here are some of the stuff I use in my day-to-day workflow.',
  path: '/uses',
});

export default function UsesPage() {
  return (
    <main className={`padding-top-10rem ${styles.main}`}>
      <div className="container-full">
        <div className={styles.intro}>
          <h1 className={styles.introText}>USES</h1>
          <div className={styles.workspace}>
            <div className="gooey__image">
              <Image
                src="/assets/img/workspace.jpeg"
                data-hover="/assets/img/workspace-hover.jpeg"
                alt="Workspace"
                width={960}
                height={1280}
                style={{ maxWidth: '100%', width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
        <div className={styles.lists}>
          <p>A curated list of the tools, gear, software, and config I use to build and create daily.</p>
          <div>
            <h2>Hardware</h2>
            <ul>
              <li>Mi Curved Gaming Monitor 34&quot;</li>
              <li>13&quot; MBP</li>
              <li>Dell Latitude 7480 + Omarchy</li>
              <li>Logitech MX Master 3s</li>
              <li>Logitech Mx Keys</li>
              <li>ASUS ANC Headphone</li>
              <li>Logitech Brio 101</li>
              <li>ZealSound USB Microphone</li>
              <li>Wowssyo RGB Mouse Pad</li>
              <li>Sit-stand Desk SSDE-06</li>
              <li>Furgle Gaming Chair</li>
              <li>Desk Clock/Lamp</li>
              <li>9&quot; Square Fill Light</li>
            </ul>
          </div>
          <div>
            <h2>Terminal Sh*t</h2>
            <ul>
              <li>Ghostty (Terminal)</li>
              <li>Neo(vim) (Editor)</li>
              <li>Rosé Pine (Theme)</li>
              <li>JetBrains Mono (Font)</li>
              <li>tmux (Terminal Multiplexer)</li>
              <li>zsh (Unix Shell)</li>
              <li>Starship (Shell Prompt)</li>
              <li>Yazi (File Manager)</li>
              <li>Fastfetch (System Info)</li>
              <li>Btop (System Monitor)</li>
              <li>
                eza (modern list <code>`ls`</code>)
              </li>
            </ul>
          </div>
          <div>
            <h2>Utility Software</h2>
            <ul>
              <li>Karabiner-Elements (Keyboard Customizer)</li>
              <li>Hammerspoon (Automation)</li>
              <li>Homebrew (OS Package Manager)</li>
              <li>Vimium (Browser Vim Control)</li>
              <li>SketchyVim (Vim-like Text Inputs)</li>
              <li>SketchyBar (Status Bar Replacement)</li>
              <li>Scoot (Cursor Actuator)</li>
              <li>JankyBorders (Window Borders)</li>
              <li>Aerospace (Window Manager)</li>
              <li>Lulu (Firewall)</li>
              <li>TunnelBear (VPN)</li>
              <li>Maccy (Clipboard Manager)</li>
              <li>HandBrake (Video Transcoder)</li>
              <li>KeyCastr (Keystroke Visualizer)</li>
              <li>FDM (Download Manager)</li>
            </ul>
          </div>
          <div>
            <h2>Config</h2>
            <ul>
              <li>
                <a
                  href="https://github.com/iamgideonidoko/dotfiles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.dotfiles}
                >
                  See on GitHub <i className="neu-arrow"></i>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Other Software</h2>
            <ul>
              <li>Chrome</li>
              <li>OrbStack</li>
              <li>ChatGPT</li>
              <li>Spotify</li>
              <li>DBeaver</li>
              <li>Figma</li>
              <li>Blender</li>
              <li>Android Studio</li>
              <li>Xcode</li>
              <li>Expo Orbit</li>
              <li>MAMP</li>
              <li>Slack</li>
              <li>Discord</li>
              <li>Postman</li>
              <li>Zoom</li>
              <li>Notion</li>
              <li>WhatsApp</li>
              <li>CapCut</li>
              <li>OBS</li>
              <li>VLC</li>
              <li>Logi Options+</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
