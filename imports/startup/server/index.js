import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import Locations from '../../api/collections/locations';

/* Indexes */
import '../../api/collections/locations/locations-indexes';

/* APIs */
import '../../api/publications/locations';
import '../../api/collections/locations/locations-methods';

Meteor.startup(() => {
  SyncedCron.add({
    name: 'Reset status to No Line if it has not been updated for a while',
    schedule(parser) {
      // parser is a later.parse object
      return parser.text('every 81 minutes');
    },
    job() {
      updateStatus();
    },
  });
  SyncedCron.start();
});
function updateStatus() {
  const now = moment();
  const locations = Locations.find({}, { sort: { createdAt: -1 } }).fetch();
  for (const i in locations) {
    const diff = now.diff(locations[i].updatedAt, 'minutes');
    if (diff >= 60) {
      Locations.upsert(locations[i]._id, {
        $set: {
          updatedAt: new Date(),
          status: 'no',
        },
      });
    }
  }
}
