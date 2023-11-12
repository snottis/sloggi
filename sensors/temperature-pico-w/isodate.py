def zfl(s, width):
    return '{:0>{w}}'.format(s, w=width)


def to_iso_date(localtime):
    return "{}-{}-{}T{}:{}:{}.{}Z".format(localtime[0], 
    zfl(localtime[1], 2), zfl(localtime[2],2),
    zfl(localtime[3], 2), zfl(localtime[4], 2),
    zfl(localtime[5], 2), '000')

