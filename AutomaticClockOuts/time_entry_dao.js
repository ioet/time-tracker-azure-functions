class TimeEntryDao {

  CONTAINER_ID = 'time_entry';

  constructor(database) {
    this.container = database.container(this.CONTAINER_ID);
  }

  async getEntriesWithNoEndDate () {
    const QUERY_WITHOUT_END_DATE =
      "SELECT * FROM c WHERE (NOT IS_DEFINED(c.end_date) OR IS_NULL(c.end_date) = true)  AND IS_DEFINED(c.start_date)";
    return this.container.items
      .query({query: QUERY_WITHOUT_END_DATE})
      .fetchAll();
  }

}

module.exports = TimeEntryDao
