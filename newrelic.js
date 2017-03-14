/**
 * Created by surajkumar on 14/03/17.
 */
/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
    /**
     * Array of application names.
     */
    app_name : ['NMV-IN-CS'],
    /**
     * Your New Relic license key.
     */
    license_key : '',
    capture_params: true,
    logging : {
        /**
         * Level at which to log. 'trace' is most useful to New Relic when diagnosing
         * issues with the agent, 'info' and higher will impose the least overhead on
         * production applications.
         */
        level : 'info'
    }
};
