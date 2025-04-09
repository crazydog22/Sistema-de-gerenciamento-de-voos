const Flight = require('../models/Flight');
const logger = require('../utils/logger');

exports.getFlights = async (req, res) => {
    try {
        const { status, origin, destination } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (origin) filter.origin = origin;
        if (destination) filter.destination = destination;

        // Paginação com validação
        const page = Math.max(1, parseInt(req.query.page) || 1);
        let limit = parseInt(req.query.limit) || 10;
        limit = Math.min(Math.max(1, limit), 100);
        const skip = (page - 1) * limit;

        const [flights, total] = await Promise.all([
            Flight.find(filter).skip(skip).limit(limit).lean(),
            Flight.countDocuments(filter)
        ]);

        logger.info(`Consulta de voos realizada - Filtros: ${JSON.stringify(filter)}`);

        res.json({
            success: true,
            data: flights,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        logger.error(`Erro ao buscar voos: ${err.message}`);
        res.status(500).json({ 
            success: false,
            error: 'Erro ao buscar voos',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
