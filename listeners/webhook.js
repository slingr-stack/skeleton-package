/****************************************************
 Listeners
 ****************************************************/

listeners.defaultWebhookDendi = {
    label: 'Catch HTTP dendi events',
    type: 'service',
    options: {
        service: 'http',
        event: 'webhook',
        matching: {
            path: '/dendi/orders',
        }
    },
    callback: function(event) {
        sys.logs.info('Received Dendi webhook. Processing and triggering a package event.');
        var headers = event.data.headers;
        var body = JSON.stringify(event.data.body);
        var params = event.data.parameters;

        if(headers['authorization'] === pkg.dendi.api.utils.getConfiguration("webhooksToken")) {
            sys.logs.info('Valid webhook received. Triggering event.');
            sys.events.triggerEvent('dendi:webhook', {
                body: body,
                params: params
            });
            return "ok";
        }
        else throw new Error("Invalid webhook");
    }
};
