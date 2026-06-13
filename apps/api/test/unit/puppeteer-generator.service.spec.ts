jest.mock('puppeteer', () => ({
  __esModule: true,
  default: {
    launch: jest.fn(),
  },
}));

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PuppeteerPdfGenerator } from '../../src/modules/prescriptions/infrastructure/pdf/puppeteer-generator.pdf';

describe('PuppeteerPdfGenerator', () => {
  let service: PuppeteerPdfGenerator;

  const page = {
    setContent: jest.fn(),
    pdf: jest.fn(),
  };

  const puppeteerService = {
    browser: {
      newPage: jest.fn(),
    },
  };

  const templateService = {
    renderPrescription: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new PuppeteerPdfGenerator(puppeteerService as any, templateService as any);
  });

  it('should generate pdf successfully', async () => {
    const html = '<h1>Prescription</h1>';

    templateService.renderPrescription.mockReturnValue(html);

    puppeteerService.browser.newPage.mockResolvedValue(page);

    page.pdf.mockResolvedValue(Buffer.from('pdf'));

    const result = await service.generatePrescription({} as any);

    expect(templateService.renderPrescription).toHaveBeenCalledTimes(1);

    expect(puppeteerService.browser.newPage).toHaveBeenCalledTimes(1);

    expect(page.setContent).toHaveBeenCalledWith(html);

    expect(page.pdf).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(Buffer);
  });
});
