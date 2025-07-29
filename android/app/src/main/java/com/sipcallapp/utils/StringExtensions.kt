package com.sipcallapp.utils

fun String?.capitalizeFirstChar(): String? {
    return this?.lowercase()?.replaceFirstChar { it.titlecase() }
}