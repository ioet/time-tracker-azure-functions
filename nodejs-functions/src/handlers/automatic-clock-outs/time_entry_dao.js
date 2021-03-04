class TimeEntryDao {

  constructor(database) {
    const CONTAINER_ID = 'time_entry';
    this.container = database.container(CONTAINER_ID);
  }

  async getEntriesWithNoEndDate () {
    const QUERY_WITHOUT_END_DATE =
      "SELECT * FROM c WHERE (NOT IS_DEFINED(c.end_date) OR IS_NULL(c.end_date) = true)  AND IS_DEFINED(c.start_date) AND (NOT IS_DEFINED(c.deleted) OR IS_NULL(c.deleted) = true)";
    return this.container.items
      .query({query: QUERY_WITHOUT_END_DATE})
      .fetchAll();
  }

}

module.exports = TimeEntryDao
