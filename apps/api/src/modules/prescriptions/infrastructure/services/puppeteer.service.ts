import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class PuppeteerService implements OnModuleInit, OnModuleDestroy {
  private _browser!: Browser;

  async onModuleInit() {
    this.browser = await puppeteer.launch();
  }

  async onModuleDestroy() {
    await this._browser.close();
  }

  get browser(): Browser {
    return this._browser;
  }

  set browser(browser: Browser) {
    this._browser = browser;
  }
}
