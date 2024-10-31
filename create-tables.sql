CREATE TABLE margins_padding (
    id SERIAL PRIMARY KEY,
    direction VARCHAR(50) NOT NULL, -- e.g., 'top', 'left', 'inner-top'
    type VARCHAR(10) NOT NULL, -- e.g., 'margin' or 'padding'
    value INT, -- Default to 0 if no value is provided
    unit VARCHAR(10) NOT NULL -- e.g., 'pt', 'px'
);

-- Insert initial values with a default value for `value` if NULL
INSERT INTO margins_padding (direction, type, value, unit) 
VALUES 
    ('top', 'padding', null, 'pt'),
    ('left', 'padding', null, 'pt'),
    ('right', 'padding', null, 'pt'),
    ('bottom', 'padding', null, 'pt'),
    ('top', 'margin', null, 'pt'),
    ('left', 'margin', null, 'pt'),
    ('right', 'margin', null, 'pt'),
    ('bottom', 'margin', null, 'pt');
