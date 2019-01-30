import { Action } from "../common";

/**
 * Partial action which should be used to extend any action which interacts with a page.
 */
export interface PageActionPartial extends Action {
  readonly pageId: string;
}
