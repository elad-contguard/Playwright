import { Page, Locator, expect } from '@playwright/test';
import { NavBar } from '../components/nav-bar.page';
import { ActionsBar, ActionsBarButton } from '../components/actions-bar.page';

export class RouteTemplatesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly pageSizeCombo: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;
  readonly navBar: NavBar;
  readonly actionsBar: ActionsBar;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Route Templates/i });
    this.table = page.getByRole('treegrid');
    this.rows = this.table.getByRole('row');
    this.pageSizeCombo = page.getByRole('combobox', { name: /Page Size/i });
    this.nextPageButton = page.getByRole('button', { name: /Next Page/i });
    this.lastPageButton = page.getByRole('button', { name: /Last Page/i });
    this.navBar = new NavBar(page);
    this.actionsBar = new ActionsBar(page);
  }

  // async goto() {
  //   await this.page.goto('/route-management');
  //   await expect(this.heading).toBeVisible();
  // }

  async startCreateRoute() {
    await this.actionsBar.clickButton(ActionsBarButton.CreateNew);
    // Add logic to handle the route creation dialog/form
  }

  async clearFilters() {
    await this.actionsBar.clickButton(ActionsBarButton.ClearFilters);
  }

  async exportToExcel() {
    await this.actionsBar.clickButton(ActionsBarButton.ExportToExcel);
  }

  async goToNextPage() {
    await this.nextPageButton.click();
  }

  async goToLastPage() {
    await this.lastPageButton.click();
  }

  // Add more methods for filtering, row actions, etc. as needed
}
