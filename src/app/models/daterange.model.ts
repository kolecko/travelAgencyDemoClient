import {Moment} from 'moment';

export interface DateRange {
  begin: Moment | null;
  end: Moment | null;
}
