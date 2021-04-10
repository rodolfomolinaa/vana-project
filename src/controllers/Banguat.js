const { soap } = require('strong-soap');
const url = 'https://www.banguat.gob.gt/variables/ws/TipoCambio.asmx?WSDL';

// Soap Service connection
const soapService = new Promise((resolve, reject) =>
    soap.createClient(url, {}, (err, client) =>
        err ? reject(err) : resolve(client),
    ),
);

const getRateByDateAndCurrency = (req, res, next) => {
    let currency = 0;

    let queryDate = new Date(req.query.date);
    let today = new Date();
    queryDate = new Date(queryDate);

    if (queryDate.getFullYear() < 2015 || queryDate > today)
        return res.status(400).json({
            msg:
                'Invalid date. Date parameter must be any day between 2015 and today',
        });

    if (req.query.currency.toUpperCase() === 'USD') {
        currency = 2;
    } else if (req.query.currency.toUpperCase() === 'EU') {
        currency = 24;
    } else {
        return res
            .status(400)
            .json({ msg: 'Invalid currency. Only USD and UE available' });
    }
    const requestArgs = {
        fechainit: req.query.date.split('-').reverse().join('-'),
        moneda: currency,
    };

    const invokeOperation = (client) =>
        new Promise((resolve, reject) =>
            client.TipoCambioFechaInicialMoneda(requestArgs, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    let element = result.TipoCambioFechaInicialMonedaResult.Vars.Var.find(
                        (item) =>
                            item.fecha.replace(/\//g, '-') ===
                            requestArgs.fechainit,
                    );

                    element = {
                        date: req.query.date,
                        currency: (currency = 2 ? 'USD' : 'EU'),
                        rate: element.venta,
                    };
                    resolve(element);
                }
            }),
        );

    soapService
        .then(invokeOperation)
        .then((result) => res.status(200).json(result))
        .catch((message) => res.status(400).json(message));
};

const getRateByRangeDateAndCurrency = (req, res, next) => {
    let currency = 0;

    if (req.query.currency.toUpperCase() === 'USD') {
        currency = 2;
    } else if (req.query.currency.toUpperCase() === 'EU') {
        currency = 24;
    } else {
        return res
            .status(400)
            .json({ msg: 'Invalid currency. Only USD and UE available' });
    }

    const requestArgs = {
        fechainit: req.query.start_date.split('-').reverse().join('-'),
        fechafin: req.query.end_date.split('-').reverse().join('-'),
        moneda: currency,
    };

    const invokeOperation = (client) =>
        new Promise((resolve, reject) =>
            client.TipoCambioRangoMoneda(requestArgs, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    let rates = result.TipoCambioRangoMonedaResult.Vars.Var.map(
                        (element) => element.venta,
                    );
                    result = {
                        start_date: req.query.start_date,
                        end_date: req.query.end_date,
                        currency: (currency = 2 ? 'USD' : 'EU'),
                        mean: rates.reduce((a, b) => a + b, 0) / rates.length,
                        max: Math.max.apply(Math, rates),
                        min: Math.min.apply(Math, rates),
                    };
                    resolve(result);
                }
            }),
        );

    soapService
        .then(invokeOperation)
        .then((result) => res.status(200).json(result))
        .catch((message) => res.status(400).json(message));
};

module.exports = {
    getRateByDateAndCurrency,
    getRateByRangeDateAndCurrency,
};
